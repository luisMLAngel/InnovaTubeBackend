import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  videoId?: string;

  @IsString()
  @IsNotEmpty()
  youtubeVideoId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  thumbnailUrl: string;

  @IsString()
  @IsNotEmpty()
  channelTitle: string;

  @IsNotEmpty()
  @IsDateString()
  publishedAt: string;
}
