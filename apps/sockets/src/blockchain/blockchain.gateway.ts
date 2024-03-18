import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MemberAvatarInfo, MemberAvatarPartsItemInven } from '@libs/entity';
import { Socket, Server } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { BlockchainService } from './blockchain.service';
import { GatewayInitiService } from '../services/gateway-init.service';
import { Decrypt } from '@libs/common';
import { NAMESPACE, RedisKey } from '@libs/constants';

@WebSocketGateway({
  namespace: NAMESPACE.BLOCKCHAIN,
  pingInterval: 30000, //30초마다 클라이언트에게 ping을 보냄
  pingTimeout: 30000, //클라이언트로부터 ping을 30초동안 받지 못하면 연결 해제
})
export class BlockchainGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @Inject(DataSource) private dataSource: DataSource,
    private readonly blockchainService: BlockchainService,
    private readonly gatewayInitService: GatewayInitiService,
  ) {}

  private readonly logger = new Logger(BlockchainGateway.name);
  @WebSocketServer()
  server: Server;

  async afterInit() {
    const isInitialized = await this.gatewayInitService.initializeGateway(
      NAMESPACE.BLOCKCHAIN,
      this.logger,
    );

    if (!isInitialized) {
      this.logger.debug('블록체인 서버가 실행되었어요.✅');
    }
  }

  //소켓 연결
  async handleConnection(client: Socket) {
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );
    const sessionId = String(Decrypt(client.handshake.auth.sessionId));

    return this.blockchainService.handleConnection(
      this.server,
      client,
      jwtAccessToken,
      sessionId,
    );
  }

  //소켓 해제
  async handleDisconnect(client: Socket) {
    await this.redisClient.del(
      RedisKey.getStrMemberSocket(client.data.memberId),
    );

    this.logger.debug('disonnected', client.id);
    this.logger.debug(`${client.id} 소켓 연결 해제 ❌`);
  }

  // 아바타 정보 새로고침
  async avatarRefresh(memberId: string) {
    console.log('recv : memberId : ' + memberId);
    const isConnected = await this.redisClient.get(
      RedisKey.getStrMemberSocket(memberId),
    );

    if (isConnected) {
      const memberAvatarInventory = await this.dataSource
        .getRepository(MemberAvatarPartsItemInven)
        .find({
          where: {
            memberId: memberId,
          },
        });

      const memberAvatarInfo = await this.dataSource
        .getRepository(MemberAvatarInfo)
        .find({
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
