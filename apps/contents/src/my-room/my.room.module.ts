import { ImageResizeService } from './../services/image-resize.service';
import { ImageAnalysisService } from './../services/Image-analysis.service';
import { MyRoomController } from './my.room.controller';
import { Module } from '@nestjs/common';
import { MyRoomService } from './my.room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  Member,
  MemberMyRoomInfo,
  SessionInfo,
} from '@libs/entity';
import { AzureBlobService, CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberMyRoomInfo, SessionInfo]),
    EntityModule,
    CommonModule,
  ],
  controllers: [MyRoomController],
  providers: [
    MyRoomService,
    ImageAnalysisService,
    ImageResizeService,
    AzureBlobService,
  ],
  exports: [MyRoomService],
})
export class MyRoomModule {}
