import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'example@example.com' }) // This will show up in Swagger
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' }) // This will show up in Swagger
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' }) // This will show up in Swagger
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'StrongPassword123' }) // This will show up in Swagger
  @IsString()
  @IsNotEmpty()
  password: string;
}
