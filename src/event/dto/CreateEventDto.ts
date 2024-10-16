import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'pizza hangout' })
  @IsString()
  @IsNotEmpty()
  name: string;
}