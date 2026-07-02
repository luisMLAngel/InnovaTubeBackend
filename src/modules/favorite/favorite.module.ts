import { Module, OnModuleInit } from '@nestjs/common';
import { errorRegistry } from 'src/common/error';
import { FAVORITE_ERRORS } from './errors/favorite.errors';
import { PrismaService } from 'src/prisma';
import { FavoriteService } from './services';
import { FavoriteController } from './controllers/favorite.controller';

@Module({
  imports: [],
  providers: [PrismaService, FavoriteService],
  controllers: [FavoriteController],
  exports: [FavoriteService],
})
export class FavoriteModule implements OnModuleInit {
  onModuleInit(): void {
    errorRegistry.registerErrors(FAVORITE_ERRORS);
  }
}
