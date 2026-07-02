import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './services';
import { UserController } from './controllers';
import { PrismaService } from 'src/prisma';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { errorRegistry } from 'src/common/error';
import { USER_ERRORS } from './errors/user.errors';

@Module({
  imports: [BcryptModule],
  providers: [PrismaService, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  onModuleInit(): void {
    errorRegistry.registerErrors(USER_ERRORS);
  }
}
