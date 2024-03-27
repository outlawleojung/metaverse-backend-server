import { Injectable } from '@nestjs/common';
import { NatsService } from '../nats/nats.service';

@Injectable()
export class NatsMessageHandler {
  private handlers = new Map<string, (message: any) => void>();
  private subscribedSubjects = new Set<string>();

  constructor(private natsService: NatsService) {}

  async registerHandler(subject: string, handler: (message: any) => void) {
    if (!this.natsService) {
      throw new Error('not connected nats');
    }
    if (!this.subscribedSubjects.has(subject)) {
      await this.natsService.subscribe(subject, (message) => {
        const handler = this.handlers.get(subject);
        if (handler) {
          handler(message);
        }
      });
      this.subscribedSubjects.add(subject);
    }
    this.handlers.set(subject, handler);
  }

  async removeHandler(subject: string) {
    if (this.subscribedSubjects.has(subject)) {
      await this.natsService.unsubscribe(subject);
      this.subscribedSubjects.delete(subject);
      this.handlers.delete(subject);
    }
  }

  async publishHandler(subject: string, message: string) {
    await this.natsService.publish(subject, message);
  }

  getSubscribe(subject): boolean {
    return this.subscribedSubjects.has(subject);
  }
}
