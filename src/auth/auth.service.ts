import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { $Enums } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // User Sign Up (Register)
  async signUp(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    // auto login after signup
    const payload = {email: user.email, sub: user.id, roles: user.roles}
    return this.signToken(payload);
  }

  // User Sign In (Login)
  async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { email: user.email, sub: user.id, roles: user.roles};
    return this.signToken(payload);

  }
  // sign in jwt token has been seperated so that we can use it in both signin and sign up
  private async signToken(payload: { email: string; sub: number; roles: $Enums.Role[]; }) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
