import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { RedisLockService } from '../services/redis-lock.service';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly tokenCheckService: TokenCheckService,
    private readonly lockService: RedisLockService,
  ) {}

  // 소켓 연결
  async handleConnection(
    server: Server,
    client: Socket,
    jwtAccessToken: string,
    sessionId: string,
  ) {
    const memberInfo =
      await this.tokenCheckService.checkLoginToken(jwtAccessToken);

    // 해당 멤버가 존재하지 않을 경우 연결 종료
    if (!memberInfo) {
      client.disconnect();
      return;
    }

    const memberId = memberInfo.memberInfo.memberId;

    client.join(memberId);
    client.join(client.handshake.auth.sessionId);

    // 클라이언트 데이터 설정
    client.data.memberId = memberId;
    client.data.sessionId = client.handshake.auth.sessionId;
    client.data.jwtAccessToken = client.handshake.auth.jwtAccessToken;
    client.data.clientId = client.id;

    this.logger.debug(
      `블록체인 서버에 연결되었어요 ✅  : ${memberId} - sessionId : ${sessionId}`,
    );
  }
}
