import {
  Controller,
  Post,
  UseGuards,
  Res,
  Body,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Request, Response } from 'express';
import { CreateAuthUserDto } from '../dtos';
import { User } from 'src/generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    return this.authService.login(req, res);
  }

  @Post('register')
  async register(
    @Body() body: CreateAuthUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    return this.authService.register(req, res, body);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(req);
  }
}
