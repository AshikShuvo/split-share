import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/CreateEventDto';
import { GetUserType } from '../common/decorator/get-user.decorator';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(eventData: CreateEventDto, user: GetUserType) {

    return this.prisma.event.create({
      data: {
        name: eventData.name,
        ownerId: user.userId,
      },
    });
  }

  async getEventsCreatedByUser(userId: number) {
    return this.prisma.event.findMany({
      where: { ownerId: userId },
    });
  }

  async getEventById(eventId: number) {
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: { members: true, spendings: true },  // You can adjust the relations included as needed
    });
  }
}
