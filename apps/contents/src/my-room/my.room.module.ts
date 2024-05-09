import { ImageResizeService } from './../services/image-resize.service';
import { ImageAnalysisService } from './../services/Image-analysis.service';
import { MyRoomController } from './my.room.controller';
import { Module } from '@nestjs/common';
import { MyRoomService } from './my.room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  Member,
  MemberFrameImage,
  MemberFrameImageRepository,
  MemberFurnitureItemInven,
  MemberFurnitureItemInvenRepository,
  MemberMyRoomInfo,
  MemberMyRoomInfoRepository,
  SessionInfo,
  StartInventory,
  StartMyRoom,
} from '@libs/entity';
import { AzureBlobService, CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberMyRoomInfo,
      MemberFrameImage,
      SessionInfo,
      StartMyRoom,
      StartInventory,
      MemberFurnitureItemInven,
    ]),
    EntityModule,
    CommonModule,
  ],
  controllers: [MyRoomController],
  providers: [
    MyRoomService,
    ImageAnalysisService,
    ImageResizeService,
    AzureBlobService,
    MemberMyRoomInfoRepository,
    MemberFrameImageRepository,
    MemberFurnitureItemInvenRepository,
  ],
  exports: [MyRoomService],
})
export class MyRoomModule {}
