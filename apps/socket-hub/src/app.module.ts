import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HubModule } from './hub/hub.module';

@Module({
  imports: [HubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
