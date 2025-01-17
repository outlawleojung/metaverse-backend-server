import { JwtService } from '@nestjs/jwt';
import {
  EmailConfirm,
  EntityModule,
  Member,
  MemberAccount,
  MemberAvatarPartsItemInven,
  MemberFurnitureItemInven,
  MemberLoginLog,
  MemberWalletInfo,
} from '@libs/entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnificationGateway } from './unification.gateway';
import { UnificationService } from './unification.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { PlayerModule } from '../player/player.module';
import { ChatModule } from '../chat/chat.module';
import { ScreenBannerModule } from '../screen-banner/screen-banner.module';
import { MyRoomModule } from '../my-room/my-room.module';
import { FriendModule } from '../friend/friend.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { OfficeModule } from '../office/office.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from '../services/redis-config.service';
import { ConfigModule } from '@nestjs/config';
import { HubSocketModule } from '../hub-socket/hub-socket.module';
import {
  RoomDataLogSchema,
  SchemaModule,
  WorldChattingLogSchema,
} from '@libs/mongodb';
import { SubscribeService } from '../nats/subscribe.service';
import { CommonModule } from '../common/common.module';
import { AuthService, CommonService } from '@libs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forFeature([
      { name: 'worldChattingLog', schema: WorldChattingLogSchema },
      { name: 'roomDataLog', schema: RoomDataLogSchema },
    ]),
    TypeOrmModule.forFeature([
      Member,
      MemberAccount,
      MemberLoginLog,
      MemberWalletInfo,
      EmailConfirm,
      MemberFurnitureItemInven,
      MemberAvatarPartsItemInven,
    ]),
    EntityModule,
    MorganModule,
    ChatModule,
    PlayerModule,
    ChatModule,
    ScreenBannerModule,
    MyRoomModule,
    FriendModule,
    MatchingModule,
    BlockchainModule,
    OfficeModule,
    CommonModule,
    EntityModule,
    SchemaModule,
    HubSocketModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    UnificationGateway,
    UnificationService,
    SubscribeService,
    CommonService,
    JwtService,
    AuthService,
  ],
  exports: [UnificationGateway, UnificationService, SubscribeService],
})
export class UnificationModule {}
