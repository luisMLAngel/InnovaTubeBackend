import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateFavoriteDto } from '../dtos';
import { Favorite } from '../../../generated/prisma/client';
import { FavoriteService } from '../services';
import { JwtAuthGuard } from '../../auth/guards';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  async createFavorite(@Body() body: CreateFavoriteDto): Promise<Favorite> {
    return this.favoriteService.create(body);
  }

  @Delete('remove/:videoId')
  @UseGuards(JwtAuthGuard)
  async removeFavorite(@Req() req: Request, @Param('videoId') videoId: string) {
    const user = req['user'];
    return this.favoriteService.removeFavorite(user.userId, videoId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findFavoritesByUserId(
    @Req() req: Request,
    @Query('search') search?: string,
  ): Promise<Favorite[]> {
    const user = req['user'];
    return this.favoriteService.findFavoritesByUserId(user.userId, search);
  }
}
