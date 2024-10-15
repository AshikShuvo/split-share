import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { CreateUserDto } from './dtos/CreateUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new user in the database.
   * @param data The data needed to create a new user (email, password, etc.)
   * @returns The created user object.
   */
  async createUser(data: CreateUserDto) {
    // Check if the user with the same email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create a new user if no conflict
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password, // In a real app, hash the password here
        roles: [Role.user], // Default role
      },
    });
  }

  /**
   * Finds a user by their email address.
   * @param email The email of the user to find.
   * @returns The user object if found, otherwise null.
   */
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Updates an existing user's information.
   * @param id The ID of the user to update.
   * @param data The data to update for the user.
   * @returns The updated user object.
   */
  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
