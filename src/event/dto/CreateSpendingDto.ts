import { Body } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateSpendingDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;
  @ApiProperty({ example: 'hello world' })
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty({ example: [1,2,3,4,5] })
  @IsNotEmpty()
  payees: number[];
}