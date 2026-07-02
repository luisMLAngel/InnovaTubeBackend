import { Module, OnModuleInit } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PrismaService } from 'src/prisma';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { JwtStrategy, LocalStrategy } from './strategies';
import { errorRegistry } from 'src/common/error';
import { AUTH_ERRORS } from './errors/auth.errors';
import { TokenService } from 'src/shared/services';
import { UserService } from '../user/services';

@Module({
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    LocalStrategy,
    TokenService,
    UserService,
  ],
  imports: [
    BcryptModule,
    PassportModule,
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule implements OnModuleInit {
  onModuleInit() {
    errorRegistry.registerErrors(AUTH_ERRORS);
  }
}
