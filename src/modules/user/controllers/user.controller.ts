import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services';
import { CreateUserDto } from '../dtos';
import { User } from 'src/generated/prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   * @param createUserDto
   * @returns
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('Received create user request:', createUserDto);
    return this.userService.create(createUserDto);
  }

  /**
   * Find user by email
   * @param body
   * @returns
   */
  @Get('by-email')
  async findByEmail(@Query('email') email: string): Promise<User | null> {
    return this.userService.findByEmail(decodeURIComponent(email));
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getUserMe(@Req() req: Request): Promise<User | null> {
    return this.userService.getUserMe(req);
  }

  /**
   * Find user by ID
   * @param body
   * @returns
   */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }
}
