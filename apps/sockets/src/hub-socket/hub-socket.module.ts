import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { HubSocketService } from './hub-socket.service';
import { GameObjectService } from '../game/game-object.service';
import { RedisLockService } from '../services/redis-lock.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { NatsService } from '../nats/nats.service';
import { RedisFunctionService } from '@libs/redis';
import { GatewayInitiService } from '../services/gateway-init.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  EmailCheck,
  EmailCheckRepository,
  EmailConfirm,
  EmailConfirmRepository,
  JumpingMatchingLevel,
  Member,
  MemberAccount,
  MemberAccountRepository,
  MemberAvatarPartsItemInven,
  MemberAvatarPartsItemInvenRepository,
  MemberFurnitureItemInven,
  MemberFurnitureItemInvenRepository,
  MemberLoginLog,
  MemberLoginLogRepository,
  MemberMyRoomInfo,
  MemberMyRoomInfoRepository,
  MemberOfficeVisitLog,
  MemberRepository,
  MemberWalletInfo,
  StartInventory,
  StartMyRoom,
} from '@libs/entity';
import { ClientService } from '../services/client.service';
import { GameData } from '../game/game-data';
import { AuthService, CommonService } from '@libs/common';
import {
  ChattingMemberInfoSchema,
  CreateFriendChattingRoomSchema,
  CreateFriendChattingSchema,
  OneOnOneChattingLogSchema,
  RoomDataLogSchema,
  WorldChattingLogSchema,
} from '@libs/mongodb';
import { GameDataService } from '../game/game-data.service';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailConfirm,
      EmailCheck,
      Member,
      MemberAccount,
      MemberLoginLog,
      MemberOfficeVisitLog,
      MemberFurnitureItemInven,
      MemberAvatarPartsItemInven,
      MemberWalletInfo,
      JumpingMatchingLevel,
      StartInventory,
      StartMyRoom,
      MemberMyRoomInfo,
      MemberLoginLog,
    ]),
    MongooseModule.forFeature([
      {
        name: 'createFriendChatting',
        schema: CreateFriendChattingSchema,
      },
      {
        name: 'createFriendChattingRoom',
        schema: CreateFriendChattingRoomSchema,
      },
      {
        name: 'chattingMemberInfo',
        schema: ChattingMemberInfoSchema,
      },
      {
        name: 'worldChattingLog',
        schema: WorldChattingLogSchema,
      },
      {
        name: 'oneononeChattingLog',
        schema: OneOnOneChattingLogSchema,
      },
      {
        name: 'roomDataLog',
        schema: RoomDataLogSchema,
      },
    ]),
  ],

  providers: [
    Repository,
    HubSocketService,
    GameObjectService,
    GameDataService,
    RedisLockService,
    NatsMessageHandler,
    NatsService,
    RedisFunctionService,
    GatewayInitiService,
    ClientService,
    GameData,
    MemberRepository,
    MemberAccountRepository,
    MemberFurnitureItemInvenRepository,
    MemberMyRoomInfoRepository,
    MemberAvatarPartsItemInvenRepository,
    EmailCheckRepository,
    EmailConfirmRepository,
    MemberLoginLogRepository,
    AuthService,
    JwtService,
    CommonService,
  ],
  exports: [
    HubSocketService,
    GameObjectService,
    GameDataService,
    NatsMessageHandler,
    RedisLockService,
    NatsService,
    RedisFunctionService,
    GatewayInitiService,
    ClientService,
    GameData,
    MemberRepository,
    MemberAccountRepository,
    AuthService,
    JwtService,
    CommonService,
    MemberFurnitureItemInvenRepository,
    MemberMyRoomInfoRepository,
    MemberAvatarPartsItemInvenRepository,
    EmailCheckRepository,
    EmailConfirmRepository,
    MemberLoginLogRepository,
  ],
})
export class HubSocketModule {}
