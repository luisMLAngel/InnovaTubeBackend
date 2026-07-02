import { IsDateString, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateVideoDto {
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
