import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';
import { AppError } from 'src/common/error';
import { JwtPayload } from 'src/modules/auth/interfaces';
import { AUTH_ERROR_CODES } from 'src/modules/auth/errors/auth.errors';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: string, email: string): string {
    const payload: JwtPayload = { sub: userId, email, type: 'access' };
    return this.jwtService.sign(payload, {
      secret: envs.JWT_SECRET,
      expiresIn: '15m',
    });
  }

  generateRefreshToken(userId: string, email: string): string {
    const payload: JwtPayload = { sub: userId, email, type: 'refresh' };
    return this.jwtService.sign(payload, {
      secret: envs.JWT_REFRESH_SECRET,
      expiresIn: '15d',
    });
  }

  verifyRefreshToken(token: string): JwtPayload {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(token, {
        secret: envs.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      throw new AppError(AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN);
    }

    if (payload.type !== 'refresh') {
      throw new AppError(AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN);
    }

    return payload;
  }
}
