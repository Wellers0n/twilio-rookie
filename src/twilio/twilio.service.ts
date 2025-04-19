import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

interface TaskAttributes {
  selected_language: string;
  [key: string]: any;
}

@Injectable()
export class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  getWorkspace() {
    return this.client.taskrouter.v1.workspaces(process.env.TWILIO_WORKSPACE_SID);
  }

  async createTask(workflowSid: string, attributes: TaskAttributes) {
    const workspace = this.getWorkspace();
    const task = await workspace.tasks.create({
      workflowSid,
      attributes: JSON.stringify(attributes),
    });
    
    console.log(task.attributes);
    return task;
  }

  async getWorkers() {
    const workspace = this.getWorkspace();
    
    return workspace.workers.list();
  }

  async handleAssignmentCallback() {
    return {
      instruction: 'dequeue',
      to: 'client:Alice',
      from: "551150281420"
    };
  }

  async acceptReservation(taskSid: string, reservationSid: string) {
    try {
      const reservation = await this.client.taskrouter
        .v1.workspaces(process.env.TWILIO_WORKSPACE_SID)
        .tasks(taskSid)
        .reservations(reservationSid)
        .update({ reservationStatus: 'accepted' });

      return {
        status: reservation.reservationStatus,
        workerName: reservation.workerName,
      };
    } catch (error) {
      throw new Error(`Failed to accept reservation: ${error.message}`);
    }
  }
}
