import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../auth/dto/role.enum';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 409, description: 'User with this email already exists.' }) // Added for conflict
  @Post('register')
  async registerUser(@Body() userData: CreateUserDto) {
    return this.userService.createUser(userData);
  }

  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(AuthGuard('jwt')) // Protect this route
  // @Roles(Role.Admin)
  @ApiBearerAuth()
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }
}
