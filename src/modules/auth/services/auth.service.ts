import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AppError } from '../../../common/error';
import { PrismaService } from '../../../prisma';
import { BcryptService } from '../../bcrypt/services/bcrypt.service';
import {
  CreateAuthUserDto,
  LoginDto,
  RequestForgotPasswordDto,
  RequestResetPasswordDto,
  ValidateUserResponseDto,
} from '../dtos';
import { AUTH_ERROR_CODES } from '../errors/auth.errors';
import { JwtPayload } from '../interfaces';
import { TokenService } from '../../../shared/services';
import { User } from '../../../generated/prisma/client';
import { UserService } from '../../user/services';
import { RecaptchaService } from './recaptcha.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly recaptchaService: RecaptchaService,
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
    const { firstName, lastName, email, password, recaptchaToken } = data;
    await this.validateEmailUniqueness(data.email);

    // verificar el captcha version 3
    const isValidRecaptcha: boolean = await this.recaptchaService.verify(
      recaptchaToken,
      'register',
    );

    if (!isValidRecaptcha) {
      throw new AppError(AUTH_ERROR_CODES.RECAPTCHA_VALIDATION_ERROR);
    }

    const passwordHash = await this.bcryptService.hash(password);
    const user = await this.prisma.user.create({
      data: { firstName, lastName, email, passwordHash },
    });
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

  async forgotPassword(data: RequestForgotPasswordDto) {
    const { email } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // No reveles si el email existe o no (buena práctica, aunque aquí regreses el token para otros casos)
      return { resetToken: null };
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    return { resetToken: token };
  }

  async resetPassword(
    data: RequestResetPasswordDto,
  ): Promise<{ success: boolean }> {
    const { token, newPassword } = data;
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new AppError(AUTH_ERROR_CODES.INVALID_OR_EXPIRED_RESET_TOKEN);
    }

    const passwordHash = await this.bcryptService.hash(newPassword);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);
    return { success: true };
  }
}
