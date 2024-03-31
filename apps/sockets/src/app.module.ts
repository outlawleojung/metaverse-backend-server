import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagerService } from './manager/manager.service';
import { ManagerController } from './manager/manager.controller';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from './services/redis-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityModule, Member, SessionInfo } from '@libs/entity';
import { DataSource } from 'typeorm';
import { SchemaModule } from '@libs/mongodb';
import { ScreenBannerModule } from './screen-banner/screen-banner.module';
import { RedisFunctionService } from '@libs/redis';
import { EventGateway } from './event/event.gateway';
import { EventModule } from './event/event.module';
import { OfficeModule } from './office/office.module';
import { FriendModule } from './friend/friend.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { TokenCheckService } from './manager/auth/tocket-check.service';
import { AppClusterService } from './cluster/app-cluster.service';
import { RedisLockService } from './services/redis-lock.service';
import { NatsService } from './nats/nats.service';
import { NatsMessageHandler } from './nats/nats-message.handler';
import { PlayerModule } from './player/player.module';
import { RoomModule } from './room/room.module';
import { MyRoomModule } from './my-room/my-room.module';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forFeature([Member, DataSource, SessionInfo]),
    ChatModule,
    ScreenBannerModule,
    OfficeModule,
    FriendModule,
    BlockchainModule,
    PlayerModule,
    RoomModule,
    EntityModule,
    SchemaModule,
    EventModule,
    MyRoomModule,
  ],
  controllers: [AppController, ManagerController],
  providers: [
    AppClusterService,
    AppService,
    TokenCheckService,
    ManagerService,
    RedisFunctionService,
    RedisLockService,
    NatsService,
    NatsMessageHandler,
    // EventGateway,
  ],
})
export class AppModule {}
