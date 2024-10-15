import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'example@example.com' }) // This will show up in Swagger
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123' }) // This will show up in Swagger
  @IsString()
  @IsNotEmpty()
  password: string;
}