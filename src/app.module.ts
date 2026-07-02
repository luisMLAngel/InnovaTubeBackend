import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { BcryptModule } from './modules/bcrypt/bcrypt.module';
import { AuthModule } from './modules/auth/auth.module';
import { ErrorModule } from './common/error/error.module';
import { LanguageMiddleware } from './common/middleware';
import { VideoModule } from './modules/video/video.module';
import { FavoriteModule } from './modules/favorite/favorite.module';

@Module({
  imports: [
    UserModule,
    BcryptModule,
    AuthModule,
    ErrorModule,
    VideoModule,
    FavoriteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
