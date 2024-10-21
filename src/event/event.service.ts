import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/CreateEventDto';
import { GetUserType } from '../common/decorator/get-user.decorator';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(eventData: CreateEventDto, user: GetUserType) {
    // Step 1: Create the event with the user as the owner
    const event = await this.prisma.event.create({
      data: {
        name: eventData.name,
        ownerId: user.userId,
      },
    });

    // Step 2: Add the owner as a member in the EventMember table
    await this.prisma.eventMember.create({
      data: {
        userId: user.userId,
        eventId: event.id,
      },
    });
    return event;
  }

  async getEventsCreatedByUser(userId: number) {
    return this.prisma.event.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async getEventById(eventId: number) {
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: { members: true, spendings: true }, // You can adjust the relations included as needed
    });
  }
  // Method for prepaying to an event
  async prepayToEvent(userId: number, eventId: number, amount: number) {
    // Check if the user is a member of the event
    const eventMember = await this.prisma.eventMember.findFirst({
      where: { userId: userId, eventId: eventId },
    });

    if (!eventMember) {
      throw new NotFoundException('User is not a member of this event');
    }

    // Create the prepay entry
    return this.prisma.prepay.create({
      data: {
        memberId: eventMember.id,
        eventId: eventId,
        amount: amount,
      },
    });
  }


  // Add spending to the event
  async addSpending(userId: number, eventId: number, amount: number, description: string) {
    // Check if the user is a member of the event
    const eventMember = await this.prisma.eventMember.findFirst({
      where: { userId: userId, eventId: eventId },
    });

    if (!eventMember) {
      throw new NotFoundException('User is not a member of this event');
    }

    // Create the spending entry
    const spending = await this.prisma.spending.create({
      data: {
        amount: amount,
        description: description,
        payerId: userId,
        eventId: eventId,
      },
    });

    // Divide the spending among all members except the payer
    const members = await this.prisma.eventMember.findMany({
      where: { eventId: eventId, NOT: { userId: userId } }, // Exclude payer
    });

    const sharePerMember = amount / members.length;

    // Create SpendingDistribution entries
    const distributionPromises = members.map((member) => {
      return this.prisma.spendingDistribution.create({
        data: {
          spendingId: spending.id,
          memberId: member.id,
          amount: sharePerMember,
        },
      });
    });

    await Promise.all(distributionPromises);
    return spending;
  }

  async getSettlement(userId: number, eventId: number) {
    // Fetch the spending distributions where the user owes money
    const owedToOthers = await this.prisma.spendingDistribution.findMany({
      where: {
        member: { userId: userId, eventId: eventId },
        isPaid: false,
      },
      include: {
        spending: true, // To get payer info
      },
    });

    // Fetch the spending distributions where the user is the payer and others owe money
    const othersOweToUser = await this.prisma.spendingDistribution.findMany({
      where: {
        spending: {
          payerId: userId,
          eventId: eventId,
        },
        isPaid: false,
      },
      include: {
        member: true, // To get member info
      },
    });

    return {
      owedToOthers,
      othersOweToUser,
    };
  }
}
