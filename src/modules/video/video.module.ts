import { Module, OnModuleInit } from '@nestjs/common';
import { errorRegistry } from '../../common/error';
import { VIDEO_ERRORS } from './errors/video.errors';
import { VideoService } from './services';
import { PrismaService } from '../../prisma';
import { VideoController } from './controllers/video.controller';

@Module({
  imports: [],
  providers: [PrismaService, VideoService],
  controllers: [VideoController],
  exports: [VideoService],
})
export class VideoModule implements OnModuleInit {
  onModuleInit(): void {
    errorRegistry.registerErrors(VIDEO_ERRORS);
  }
}
