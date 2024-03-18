import { OfficeController } from './office.controller';
import { Module } from '@nestjs/common';
import { OfficeService } from './office.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  Member,
  MemberOfficeReservationInfo,
  MemberOfficeReservationWaitingInfo,
  OfficeGradeAuthority,
  OfficeRoomCodeLog,
  OfficeSpaceInfo,
} from '@libs/entity';
import { AzureBlobService, CommonModule, OfficeLogService } from '@libs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CreateOfficeSchema,
  WaitDeleteOfficeSchema,
  SchemaModule,
  UpdateOfficeSchema,
  WaitOfficeSchema,
} from '@libs/mongodb';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'createOffice', schema: CreateOfficeSchema },
      { name: 'updateOffice', schema: UpdateOfficeSchema },
      { name: 'waitOffice', schema: WaitOfficeSchema },
      { name: 'waitDeleteOffice', schema: WaitDeleteOfficeSchema },
    ]),
    TypeOrmModule.forFeature([
      Member,
      MemberOfficeReservationInfo,
      MemberOfficeReservationWaitingInfo,
      OfficeGradeAuthority,
      OfficeRoomCodeLog,
      OfficeSpaceInfo,
      SchemaModule,
    ]),
    EntityModule,
    CommonModule,
  ],
  controllers: [OfficeController],
  providers: [OfficeService, AzureBlobService, OfficeLogService],
  exports: [OfficeService],
})
export class OfficeModule {}
