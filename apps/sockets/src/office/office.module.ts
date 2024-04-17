import { Member, MemberOfficeReservationInfo } from '@libs/entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';
import { OfficeWebService } from './office.web.service';
import { HubSocketModule } from '../hub-socket/hub-socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberOfficeReservationInfo]),
    HubSocketModule,
  ],
  providers: [OfficeService, OfficeWebService],
  controllers: [OfficeController],
  exports: [OfficeService, OfficeWebService],
})
export class OfficeModule {}
