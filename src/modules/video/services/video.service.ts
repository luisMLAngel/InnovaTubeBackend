import { Injectable } from '@nestjs/common';
import { Video } from '../../../generated/prisma/client';
import { PrismaService } from '../../../prisma';
import { CreateVideoDto } from '../dtos';

@Injectable()
export class VideoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVideoDto): Promise<Video> {
    return await this.prisma.video.upsert({
      where: { youtubeVideoId: data.youtubeVideoId },
      update: {},
      create: {
        youtubeVideoId: data.youtubeVideoId,
        title: data.title,
        channelTitle: data.channelTitle,
        thumbnailUrl: data.thumbnailUrl,
        publishedAt: new Date(data.publishedAt),
      },
    });
  }
}
