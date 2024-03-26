import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Decrypt } from '@libs/common';
import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
import { ManagerService } from './manager.service';
import { GatewayInitiService } from '../services/gateway-init.service';
import { NatsService } from '../nats/nats.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import {
  CHATTING_SOCKET_C_GLOBAL,
  NAMESPACE,
  NATS_EVENTS,
  RedisKey,
} from '@libs/constants';

@WebSocketGateway({
  // cors: {
  //   origin: '*',
  // },
  // pingInterval: 30000, //30초마다 클라이언트에게 ping을 보냄
  // pingTimeout: 30000, //클라이언트로부터 ping을 30초동안 받지 못하면 연결 해제
})
@Injectable()
export class ManagerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly managerService: ManagerService,
    private readonly gatewayInitService: GatewayInitiService,
    private readonly natsService: NatsService,
    private readonly messageHandler: NatsMessageHandler,
  ) {}
  private readonly logger = new Logger(ManagerGateway.name);
  @WebSocketServer()
  private server: Server;

  getServer() {
    return this.server;
  }

  async afterInit() {
    const isInitialized = await this.gatewayInitService.initializeGateway(
      NAMESPACE.MANAGER,
      this.logger,
    );

    if (!isInitialized) {
      this.logger.debug('매니저 서버가 실행되었어요.✅');
    }
  }

  //소켓 연결
  async handleConnection(client: Socket) {
    this.logger.debug('매니저 소켓 연결중.✅');
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );

    const sessionId = String(Decrypt(client.handshake.auth.sessionId));

    this.managerService.handleConnection(
      this.server,
      client,
      jwtAccessToken,
      sessionId,
    );

    // 중복 로그인 알림 구독
    this.messageHandler.registerHandler(
      `${NATS_EVENTS.DUPLICATE_LOGIN_USER}:${sessionId}`,
      (sessionId) => {
        // 서버에서 소켓 연결 제거
        this.server.sockets.sockets.get(sessionId)?.disconnect();
      },
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

  // 닉네임 변경 요청
  @SubscribeMessage(CHATTING_SOCKET_C_GLOBAL.C_CHANGE_NICKNAME)
  async debugMessage(client: Socket) {
    return this.managerService.nicknameChange(client);
  }
}
