import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/config';
import { JwtPayload, JwtValidatedUser } from '../interfaces';
import { AppError } from 'src/common/error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtValidatedUser> {
    if (!payload || !payload.sub) {
      throw new AppError('Invalid JWT payload');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      type: payload.type,
    };
  }
}
