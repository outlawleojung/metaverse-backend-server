import { EntityModule, Member, SessionInfo } from '@libs/entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { TokenCheckService } from './auth/tocket-check.service';
import { UnificationGateway } from './unification.gateway';
import { UnificationService } from './unification.service';
import { RedisFunctionService } from '@libs/redis';
import { GatewayInitiService } from '../services/gateway-init.service';
import { RedisLockService } from '../services/redis-lock.service';
import { NatsService } from '../nats/nats.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { PlayerModule } from '../player/player.module';
import { GameObjectService } from '../player/game/game-object.service';
import { ChatModule } from '../chat/chat.module';
import { ScreenBannerModule } from '../screen-banner/screen-banner.module';
import { MyRoomModule } from '../my-room/my-room.module';
import { FriendModule } from '../friend/friend.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { OfficeModule } from '../office/office.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, SessionInfo]),
    AppModule,
    EntityModule,
    MorganModule,
    PlayerModule,
    ChatModule,
    ScreenBannerModule,
    MyRoomModule,
    FriendModule,
    BlockchainModule,
    OfficeModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    UnificationGateway,
    UnificationService,
    TokenCheckService,
    RedisFunctionService,
    TokenCheckService,
    GatewayInitiService,
    RedisLockService,
    NatsService,
    NatsMessageHandler,
    GameObjectService,
  ],
  exports: [UnificationGateway, UnificationService],
})
export class UnificationModule {}
