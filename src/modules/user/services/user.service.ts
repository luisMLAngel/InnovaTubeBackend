import { Injectable } from '@nestjs/common';
import { User } from '../../../generated/prisma/client';
import { BcryptService } from '../../bcrypt/services/bcrypt.service';
import { PrismaService } from '../../../prisma';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { AppError } from '../../../common/error';
import { USER_ERROR_CODES } from '../errors/user.errors';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}

  /**
   * Validate email uniqueness
   * @param email
   */
  private async validateEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });
    if (existingUser) {
      throw new AppError(USER_ERROR_CODES.EMAIL_ALREADY_EXISTS);
    }
  }

  /**
   * Hash password
   * @param password
   * @returns
   */
  private async hashPassword(password: string): Promise<string> {
    return await this.bcryptService.hash(password);
  }

  private async validateGetUser(user: User | null): Promise<User> {
    if (!user) {
      throw new AppError(USER_ERROR_CODES.USER_NOT_FOUND);
    }
    return user;
  }

  /**
   *  Find user by email
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    await this.validateGetUser(user);
    return user;
  }

  /**
   * Find user by id
   * @param userId
   * @returns
   */
  async findById(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.validateGetUser(user);
    return user;
  }

  /**
   * Create a new user
   * @param data
   * @returns
   */
  async create(data: CreateUserDto): Promise<User> {
    await this.validateEmailUniqueness(data.email);
    return this.prisma.user.create({
      data: {
        ...data,
        passwordHash: await this.hashPassword(data.passwordHash),
      },
    });
  }

  /**
   * Update user data
   * @param userId
   * @param data
   * @returns
   */
  async update(userId: string, data: UpdateUserDto): Promise<User> {
    await this.findById(userId);
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  /**
   * Delete user (soft delete)
   * @param userId
   * @returns
   */
  async delete(userId: string): Promise<User> {
    await this.findById(userId);
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async getUserMe(req: Request) {
    const userId = req['user']?.['userId'];
    if (!userId) {
      throw new AppError(USER_ERROR_CODES.USER_NOT_FOUND);
    }
    const user = await this.findById(userId);
    return { ...user, passwordHash: undefined };
  }
}
