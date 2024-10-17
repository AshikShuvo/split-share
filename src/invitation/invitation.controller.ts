import { Controller, Post, Body, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { ActionType, CreateInvitationDto } from './dto/create-invitation.dto';
import { GetUser, GetUserType } from '../common/decorator/get-user.decorator';

@ApiTags('Invitations')
@ApiBearerAuth() // Add Bearer token auth to all routes in this controller
@UseGuards(AuthGuard('jwt')) // JWT authentication guard for all routes
@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @ApiOperation({ summary: 'Send an invitation to a user for an event' })
  @ApiBody({ type: CreateInvitationDto }) // Show DTO structure in Swagger UI
  @ApiResponse({ status: 201, description: 'Invitation successfully sent.' })
  @ApiResponse({ status: 400, description: 'Invalid input or already invited.' })
  @ApiResponse({ status: 404, description: 'Invitee not found.' })
  @Post('send')
  async sendInvitation(
    @Body() createInvitationDto: CreateInvitationDto,
    @GetUser() inviter: GetUserType,
  ) {
    return this.invitationService.sendInvitation(createInvitationDto, inviter);
  }

  @ApiOperation({ summary: 'Get all invitations sent by the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of sent invitations.' })
  @Get('sent')
  async getSentInvitations(@GetUser() user: GetUserType) {
    return this.invitationService.getSentInvitations(user.userId);
  }

  @ApiOperation({ summary: 'Get all invitations received by the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of received invitations.' })
  @Get('received')
  async getReceivedInvitations(@GetUser() user: GetUserType) {
    return this.invitationService.getReceivedInvitations(user.userId);
  }

  @ApiOperation({ summary: 'Get a specific invitation by ID' })
  @ApiResponse({ status: 200, description: 'Invitation details.' })
  @ApiResponse({ status: 404, description: 'Invitation not found.' })
  @Get(':id')
  async getInvitationById(@Param('id') id: number) {
    return this.invitationService.getInvitationById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Respond to an invitation (accept or reject)' })
  @ApiParam({ name: 'invitationId', description: 'ID of the invitation' })
  @Patch(':invitationId/:action')
  async respondToInvitation(
    @Param('invitationId') invitationId: number,
    @Param('action') action: 'accept' | 'reject',
    @GetUser() user: GetUserType,
  ) {
    return this.invitationService.respondToInvitation(invitationId, user.userId, action);
  }
}
