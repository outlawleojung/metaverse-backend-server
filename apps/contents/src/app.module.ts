import { OthersModule } from './others/others.module';
import { OthersController } from './others/others.controller';
import { MyRoomController } from './my-room/my.room.controller';
import { MyRoomModule } from './my-room/my.room.module';
import { VoteModule } from './vote/vote.module';
import { VoteController } from './vote/vote.controller';
import { AppService } from './app.service';
import { FriendService } from './friend/friend.service';
import { Module } from '@nestjs/common';
import {
  AzureBlobService,
  JwtGuard,
  JwtAuthModule,
  SessionModule,
  CommonService,
} from '@libs/common';
import { FriendController } from './friend/friend.controller';
import { FriendModule } from './friend/friend.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { ConfigModule } from '@nestjs/config';
import {
  EntityModule,
  Member,
  MemberAvatarPartsItemInven,
  MemberFurnitureItemInven,
  MemberMyRoomInfo,
  StartInventory,
  MemberWalletInfo,
} from '@libs/entity';
import { AppController } from './app.controller';
import { OfficeController } from './office/office.controller';
import { OfficeModule } from './office/office.module';
import { RankingModule } from './ranking/ranking.module';
import { RankingController } from './ranking/ranking.controller';
import {
  CreateOfficeSchema,
  WaitOfficeSchema,
  WaitDeleteOfficeSchema,
  SchemaModule,
  UpdateOfficeSchema,
  WorldChattingLogSchema,
  RoomDataLogSchema,
} from '@libs/mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import { OfficeLogService } from '@libs/common';
import { PostboxModule } from './postbox/postbox.module';
import { PostboxController } from './postbox/postbox.controller';
import { ImageAnalysisService } from './services/Image-analysis.service';
// import { PrismaModule } from '@libs/prisma';
import { ImageResizeService } from './services/image-resize.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreenBannerController } from './screen-banner/screen-banner.controller';
import { ScreenBannerModule } from './screen-banner/screen-banner.module';
import { SelectVoteModule } from './select-vote/select-vote.module';
import { AdContentsModule } from './ad-contents/ad-contents.module';
import { NftModule } from './nft/nft.module';
import { NftController } from './nft/nft.controller';
import { CsafModule } from './csaf/csaf.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberMyRoomInfo,
      MemberFurnitureItemInven,
      StartInventory,
      MemberAvatarPartsItemInven,
      MemberWalletInfo,
    ]),
    MongooseModule.forFeature([
      { name: 'createOffice', schema: CreateOfficeSchema },
      { name: 'updateOffice', schema: UpdateOfficeSchema },
      { name: 'waitOffice', schema: WaitOfficeSchema },
      { name: 'waitDeleteOffice', schema: WaitDeleteOfficeSchema },
      { name: 'worldChattingLog', schema: WorldChattingLogSchema },
      { name: 'roomDataLog', schema: RoomDataLogSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MorganModule,
    EntityModule,
    FriendModule,
    MyRoomModule,
    VoteModule,
    OfficeModule,
    OthersModule,
    RankingModule,
    SessionModule,
    SchemaModule,
    JwtAuthModule,
    PostboxModule,
    ScreenBannerModule,
    SelectVoteModule,
    AdContentsModule,
    StartInventory,
    NftModule,
    CsafModule,
  ],
  controllers: [
    AppController,
    FriendController,
    VoteController,
    OfficeController,
    MyRoomController,
    OthersController,
    RankingController,
    PostboxController,
    ScreenBannerController,
    NftController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    AppService,
    JwtGuard,
    AzureBlobService,
    OfficeLogService,
    ImageAnalysisService,
    ImageResizeService,
    CommonService,
  ],
})
export class AppModule {}
