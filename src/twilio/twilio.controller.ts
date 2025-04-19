import { Controller, Post, Body, Get } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('assignment_callback')
  async assignmentCallback() {
    return this.twilioService.handleAssignmentCallback();
  }

  @Get('assignment_callback')
  async getAssignmentCallback() {
    return this.twilioService.handleAssignmentCallback();
  }

  @Post('create_task')
  async createTask() {
    return this.twilioService.createTask(process.env.TWILIO_WORKFLOW_SID, {
      selected_language: 'es',
      // instruction: 'dequeue',
    });
  }

  @Post('accept_reservation')
  async acceptReservation(
    @Body() body: { taskSid: string; reservationSid: string },
  ) {
    return this.twilioService.acceptReservation(
      body.taskSid,
      body.reservationSid,
    );
  }
}
