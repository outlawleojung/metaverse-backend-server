import { Module } from '@nestjs/common';
import { CsafController } from './csaf.controller';
import { CsafService } from './csaf.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  Member,
  MemberOfficeReservationInfo,
  MemberOfficeReservationWaitingInfo,
  OfficeGradeAuthority,
  OfficeSpaceInfo,
  CSAFEventEnterLog,
} from '@libs/entity';
import { AzureBlobService, CommonModule } from '@libs/common';
import { OfficeService } from '../office/office.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberOfficeReservationInfo,
      MemberOfficeReservationWaitingInfo,
      OfficeGradeAuthority,
      OfficeSpaceInfo,
      CSAFEventEnterLog,
    ]),
    EntityModule,
    CommonModule,
  ],
  controllers: [CsafController],
  providers: [CsafService, AzureBlobService, OfficeService],
  exports: [CsafService],
})
export class CsafModule {}
