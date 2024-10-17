// src/invitation/invitation.service.ts

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { GetUserType } from '../common/decorator/get-user.decorator';
import { InvitationStatus } from '@prisma/client'; // Import the User entity

@Injectable()
export class InvitationService {
  constructor(private prisma: PrismaService) {}

  async sendInvitation(createInvitationDto: CreateInvitationDto, inviter: GetUserType) {
    const { eventId, inviteeEmail } = createInvitationDto;

    // Check if the inviter owns the event
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { owner: true },
    });

    if (!event || event.ownerId !== inviter.userId) {
      throw new BadRequestException('You are not the owner of this event.');
    }

    // Check if invitee exists
    const invitee = await this.prisma.user.findUnique({
      where: { email: inviteeEmail },
    });

    if (!invitee) {
      throw new NotFoundException('Invitee not found.');
    }

    // Check if an active invitation already exists
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: { eventId, inviteeId: invitee.id, status: 'PENDING' },
    });

    if (existingInvitation) {
      throw new BadRequestException('An invitation is already pending for this user.');
    }

    // Create invitation
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 15); // Set expiration 15 minutes from now

    return this.prisma.invitation.create({
      data: {
        eventId,
        inviterId: inviter.userId,
        inviteeId: invitee.id,
        expirationDate,
      },
    });
  }
  // Get all invitations sent by the logged-in user
  async getSentInvitations(inviterId: number) {
    return this.prisma.invitation.findMany({
      where: { inviterId },
      include: {
        event: true, // Include event details
        invitee: {
          select: { email: true, firstName: true, lastName: true }, // Select invitee details
        },
      },
    });
  }

  // Get all invitations received by the logged-in user
  async getReceivedInvitations(inviteeId: number) {
    return this.prisma.invitation.findMany({
      where: { inviteeId },
      include: {
        event: true, // Include event details
        inviter: {
          select: { email: true, firstName: true, lastName: true }, // Select inviter details
        },
      },
    });
  }

  // Get a specific invitation by its ID
  async getInvitationById(id: number) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
      include: {
        event: true, // Include event details
        inviter: {
          select: { email: true, firstName: true, lastName: true }, // Select inviter details
        },
        invitee: {
          select: { email: true, firstName: true, lastName: true }, // Select invitee details
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException(`Invitation with ID ${id} not found`);
    }

    return invitation;
  }
  // Accept or reject an invitation
  async respondToInvitation(invitationId: number, userId: number, action: 'accept' | 'reject') {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { event: true },
    });

    if (!invitation) {
      throw new NotFoundException(`Invitation with ID ${invitationId} not found`);
    }

    if (invitation.inviteeId !== userId) {
      throw new BadRequestException(`You are not authorized to respond to this invitation.`);
    }

    // Check if the invitation is still pending and not expired
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException(`This invitation has already been responded to.`);
    }

    if (new Date() > invitation.expirationDate) {
      throw new BadRequestException(`This invitation has expired.`);
    }

    // Handle accept or reject
    if (action === 'accept') {
      // Add the invitee as a member of the event
      await this.prisma.eventMember.create({
        data: {
          eventId: invitation.eventId,
          userId: invitation.inviteeId,
        },
      });

      // Update the invitation status to ACCEPTED
      await this.prisma.invitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.ACCEPTED },
      });

      return { message: 'Invitation accepted and user added to the event.' };
    } else if (action === 'reject') {
      // Update the invitation status to REJECTED
      await this.prisma.invitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.REJECTED },
      });

      return { message: 'Invitation rejected.' };
    }

    throw new BadRequestException('Invalid action. Must be "accept" or "reject".');
  }
}
