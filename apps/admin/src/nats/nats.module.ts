import { Module, Global } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { NatsService } from './nats.service';

dotenv.config();

@Global()
@Module({
  providers: [
    {
      provide: 'NATS_OPTIONS',
      useValue: {
        servers: [process.env.NATS_URL], // 예: 'nats://localhost:4222'
      },
    },
    NatsService,
  ],
  exports: [NatsService, 'NATS_OPTIONS'],
})
export class NatsModule {}
