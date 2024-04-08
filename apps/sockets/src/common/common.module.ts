import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { HubSocketModule } from '../hub-socket/hub-socket.module';

@Module({
  imports: [HubSocketModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
