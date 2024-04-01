import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import { TokenCheckService } from '../unification/auth/tocket-check.service';
import { RedisKey } from '@libs/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberAvatarInfo, MemberAvatarPartsItemInven } from '@libs/entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(MemberAvatarPartsItemInven)
    private memberAvatarPartsItemInvenRepository: Repository<MemberAvatarPartsItemInven>,
    @InjectRepository(MemberAvatarInfo)
    private mberAvatarInfoRepository: Repository<MemberAvatarInfo>,
    private readonly tokenCheckService: TokenCheckService,
  ) {}

  private server: Server;
  async setServer(server: Server) {
    this.server = server;
  }

  // 아바타 정보 새로고침
  async avatarRefresh(memberId: string) {
    const isConnected = await this.redisClient.get(
      RedisKey.getStrMemberSocket(memberId),
    );

    if (isConnected) {
      const memberAvatarInventory =
        await this.memberAvatarPartsItemInvenRepository.find({
          where: {
            memberId: memberId,
          },
        });

      const memberAvatarInfo = await this.mberAvatarInfoRepository.find({
        where: {
          memberId: memberId,
        },
      });

      console.log('######### AVATAR ###########');

      const avatarInfo = {
        memberAvatarPartsItemInven: JSON.stringify(memberAvatarInventory),
        memberAvatarInfo: JSON.stringify(memberAvatarInfo),
      };

      return await this.server
        .to(memberId)
        .emit('S_AvatarDataRefresh', JSON.stringify(avatarInfo));
    }
  }
}
