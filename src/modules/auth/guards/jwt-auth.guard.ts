import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AppError } from 'src/common/error';
import { AUTH_ERROR_CODES } from '../errors/auth.errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new AppError(AUTH_ERROR_CODES.INVALID_TOKEN);
    }
    return user;
  }
}
