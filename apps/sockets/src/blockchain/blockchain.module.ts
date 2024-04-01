import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { TokenCheckService } from '../unification/auth/tocket-check.service';
import { RedisFunctionService } from '@libs/redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Member,
  MemberAvatarInfo,
  MemberAvatarPartsItemInven,
  SessionInfo,
} from '@libs/entity';
import { CommonModule } from '@libs/common';
import { HubSocketModule } from '../hub-socket/hub-socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      SessionInfo,
      MemberAvatarPartsItemInven,
      MemberAvatarInfo,
    ]),
    CommonModule,
    HubSocketModule,
  ],
  providers: [BlockchainService],
  controllers: [BlockchainController],
  exports: [BlockchainService],
})
export class BlockchainModule {}
