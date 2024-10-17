// src/invitation/dtos/create-invitation.dto.ts

import { IsEmail, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvitationDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the event for which the invitation is being sent',
  })
  @IsInt()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty({
    example: 'invitee@example.com',
    description: 'The email of the user being invited to the event',
  })
  @IsEmail()
  @IsNotEmpty()
  inviteeEmail: string;
}

export class ActionType{
  action: 'accept' | 'reject';
}