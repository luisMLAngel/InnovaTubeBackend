import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateFavoriteDto } from '../dtos';
import { Favorite } from 'src/generated/prisma/client';
import { FavoriteService } from '../services';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  async createFavorite(@Body() body: CreateFavoriteDto): Promise<Favorite> {
    console.log('Received create favorite request:', body);
    return this.favoriteService.create(body);
  }

  @Delete(':videoId/:userId')
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('videoId') videoId: string,
  ) {
    return this.favoriteService.removeFavorite(userId, videoId);
  }

  @Get()
  async findFavoritesByUserId(
    @Param('userId') userId: string,
    @Param('search') search?: string,
  ): Promise<Favorite[]> {
    return this.favoriteService.findFavoritesByUserId(userId, search);
  }
}
