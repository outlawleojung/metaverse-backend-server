import { Module } from '@nestjs/common';
import { HubService } from './hub.service';
import { HubGateway } from './hub.gateway';

@Module({
  providers: [HubGateway, HubService],
})
export class HubModule {}
