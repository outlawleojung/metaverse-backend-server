import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, SessionInfo, MemberOfficeVisitLog } from '@libs/entity';
import { DataSource } from 'typeorm';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { RedisFunctionService } from '@libs/redis';
import {
  CreateFriendChattingSchema,
  OneOnOneChattingLogSchema,
  RoomDataLogSchema,
  WorldChattingLogSchema,
} from '@libs/mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateFriendChattingRoomSchema } from '@libs/mongodb';
import { ChattingMemberInfoSchema } from '@libs/mongodb';
import { CommonModule } from '@libs/common';
import { NatsService } from '../nats/nats.service';
import { GatewayInitiService } from '../services/gateway-init.service';
import { RedisLockService } from '../services/redis-lock.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      DataSource,
      SessionInfo,
      MemberOfficeVisitLog,
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
    CommonModule,
  ],
  providers: [
    ChatService,
    TokenCheckService,
    RedisFunctionService,
    NatsService,
    GatewayInitiService,
    RedisLockService,
    NatsMessageHandler,
  ],
  exports: [ChatService],
})
export class ChatModule {}
