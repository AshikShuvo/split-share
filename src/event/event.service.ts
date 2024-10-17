import { Injectable } from '@nestjs/common';
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
}
