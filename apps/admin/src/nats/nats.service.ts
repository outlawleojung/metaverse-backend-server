import { Inject, Injectable } from '@nestjs/common';
import { NatsConnection, connect, StringCodec } from 'nats';

@Injectable()
export class NatsService {
  private natsConnection: NatsConnection;

  constructor(@Inject('NATS_OPTIONS') private options: any) {
    this.initialize();
  }

  private async initialize() {
    this.natsConnection = await connect({
      servers: this.options.servers,
    });
  }

  async publish(subject: string, data: string) {
    if (!this.natsConnection) {
      throw new Error('NATS connection is not initialized');
    }
    const sc = StringCodec();
    this.natsConnection.publish(subject, sc.encode(data));
    console.log(
      `#################### [ publish ] subject : ${subject} - data : ${data}`,
    );
  }
}
