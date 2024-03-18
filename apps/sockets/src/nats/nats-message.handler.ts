import { Injectable } from '@nestjs/common';
import { NatsService } from '../nats/nats.service';

@Injectable()
export class NatsMessageHandler {
  private handlers = new Map<string, (message: any) => void>();
  private subscribedSubjects = new Set<string>();

  constructor(private natsService: NatsService) {}

  registerHandler(subject: string, handler: (message: any) => void) {
    if (!this.natsService) {
      throw new Error('not connected nats');
    }
    if (!this.subscribedSubjects.has(subject)) {
      this.natsService.subscribe(subject, (message) => {
        const handler = this.handlers.get(subject);
        if (handler) {
          handler(message);
        }
      });
      this.subscribedSubjects.add(subject);
    }
    this.handlers.set(subject, handler);
  }

  removeHandler(subject: string) {
    if (this.subscribedSubjects.has(subject)) {
      this.natsService.unsubscribe(subject);
      this.subscribedSubjects.delete(subject);
      this.handlers.delete(subject);
    }
  }

  getSubscribe(subject): boolean {
    return this.subscribedSubjects.has(subject);
  }
}
