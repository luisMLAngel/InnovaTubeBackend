import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AppError } from 'src/common/error';
import { PrismaService } from 'src/prisma';
import { BcryptService } from '../../bcrypt/services/bcrypt.service';
import { CreateAuthUserDto, LoginDto, ValidateUserResponseDto } from '../dtos';
import { AUTH_ERROR_CODES } from '../errors/auth.errors';
import { JwtPayload } from '../interfaces';
import { TokenService } from 'src/shared/services';
import { User } from 'src/generated/prisma/client';
import { UserService } from 'src/modules/user/services';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async validateUser({
    email,
    password,
  }: LoginDto): Promise<ValidateUserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(AUTH_ERROR_CODES.INVALID_CREDENTIALS, {
        userNotFound: true,
      });
    }
    const isPasswordValid = await this.bcryptService.compare(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new AppError(AUTH_ERROR_CODES.INVALID_CREDENTIALS, {
        invalidPassword: true,
      });
    }
    return { id: user.id, email: user.email };
  }

  async login(
    req: Request,
    res: Response,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const user = req.user as ValidateUserResponseDto;
    const userRecord = await this.userService.findById(user.id);
    const accessToken = await this.tokenService.generateAccessToken(
      user.id,
      user.email,
    );
    const refreshToken = await this.tokenService.generateRefreshToken(
      user.id,
      user.email,
    );
    return {
      accessToken,
      refreshToken,
      user: { ...userRecord, passwordHash: undefined },
    };
  }

  private async validateEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });
    if (existingUser) {
      throw new AppError(AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS);
    }
  }

  async register(
    req: Request,
    res: Response,
    data: CreateAuthUserDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    console.log('REGISTRANDO USUARIO', data);
    const { firstName, lastName, email, password } = data;
    await this.validateEmailUniqueness(data.email);
    const passwordHash = await this.bcryptService.hash(password);
    console.log('contraseña hasheada', passwordHash);
    const user = await this.prisma.user.create({
      data: { firstName, lastName, email, passwordHash },
    });
    console.log('USUARIO CREADO', user);
    const accessToken = await this.tokenService.generateAccessToken(
      user.id,
      user.email,
    );
    const refreshToken = await this.tokenService.generateRefreshToken(
      user.id,
      user.email,
    );
    return { accessToken, refreshToken, user };
  }

  async refreshToken(
    req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      throw new AppError(AUTH_ERROR_CODES.REFRESH_TOKEN_NOT_PROVIDED);
    }

    let payload: JwtPayload;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError(AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN);
    }

    const newAccessToken = this.tokenService.generateAccessToken(
      payload.sub,
      payload.email,
    );
    const newRefreshToken = this.tokenService.generateRefreshToken(
      payload.sub,
      payload.email,
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
