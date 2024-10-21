import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from './dto/CreateEventDto';
import { GetUser, GetUserType } from '../common/decorator/get-user.decorator';
import { CreateSpendingDto } from './dto/CreateSpendingDto'; // Custom decorator to get logged-in user

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event successfully created.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createEvent(@Body() eventData: CreateEventDto, @GetUser() user: GetUserType) {
    console.log(user);
     return this.eventService.createEvent(eventData, user);
  }

  @ApiOperation({ summary: 'Get events created by the user' })
  @ApiResponse({ status: 200, description: 'List of events.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('my-events')
  async getMyEvents(@GetUser() user: GetUserType) {
    return this.eventService.getEventsCreatedByUser(user.userId);
  }

  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event found.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getEventById(@Param('id') id: number) {
    return this.eventService.getEventById(id);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Prepay to an event as a member' })
  @Post(':id/prepay/:amount')
  async prepayToEvent(
    @GetUser() user: GetUserType,
    @Param('amount') amount: number,
    @Param('id') eventId: number
  ) {
    return this.eventService.prepayToEvent(user.userId, eventId, amount);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add spending to an event' })
  @Post(':id/add-spending')
  async addSpending(
    @GetUser() user: GetUserType,
    @Param('id') eventId: number,
    @Body() createSpending: CreateSpendingDto
  ) {
    const {amount, description, payees} = createSpending
    return this.eventService.addSpending(user.userId, eventId, amount, description);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get settlement info for an event' })
  @Get(':id/settlement')
  async getSettlement(
    @GetUser() user : GetUserType,
    @Param('id') eventId: number,
  ) {
    return this.eventService.getSettlement(user.userId, eventId);
  }
}
