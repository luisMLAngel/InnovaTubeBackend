import { Injectable } from '@nestjs/common';
import { Favorite, Video } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma';
import { CreateFavoriteDto } from '../dtos';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFavoriteDto): Promise<Favorite> {
    const video: Video = await this.prisma.video.upsert({
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
    return this.prisma.favorite.create({
      data: {
        userId: data.userId,
        videoId: video.id,
      },
    });
  }

  async removeFavorite(userId: string, videoId: string) {
    return this.prisma.favorite.delete({
      where: { userId_videoId: { userId, videoId } },
    });
  }

  async findFavoritesByUserId(
    userId: string,
    search?: string,
  ): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: {
        userId,
        ...(search && {
          video: {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        }),
      },
      include: { Video: true },
    });
  }
}
