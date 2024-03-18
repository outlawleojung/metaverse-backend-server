import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OfficeService } from './office.service';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { GatewayInitiService } from '../services/gateway-init.service';
import { Decrypt } from '@libs/common';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { NatsService } from '../nats/nats.service';
import {
  NAMESPACE,
  NATS_EVENTS,
  OFFICE_SOCKET_C_MESSAGE,
  OFFICE_SOCKET_S_MESSAGE,
  SOCKET_SERVER_ERROR_CODE_GLOBAL,
} from '@libs/constants';

@WebSocketGateway({
  namespace: NAMESPACE.OFFICE,
  pingInterval: 30000, //30초마다 클라이언트에게 ping을 보냄
  pingTimeout: 30000, //클라이언트로부터 ping을 30초동안 받지 못하면 연결 해제
})
export class OfficeGateway {
  private readonly logger = new Logger(OfficeGateway.name);
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly officeService: OfficeService,
    private readonly messageHandler: NatsMessageHandler,
    private readonly natsService: NatsService,
    private readonly gatewayInitService: GatewayInitiService,
  ) {}
  @WebSocketServer()
  server: Server;
  // 초기화
  async afterInit() {
    const isInitialized = await this.gatewayInitService.initializeGateway(
      NAMESPACE.OFFICE,
      this.logger,
    );

    if (!isInitialized) {
      this.logger.debug('오피스 서버가 실행되었어요.✅');
    }

    this.natsService.on(NATS_EVENTS.NATS_CONNECTED, async () => {
      await this.registerSubscribe();
    });
  }

  async handleConnection(client: Socket) {
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );
    const sessionId = String(Decrypt(client.handshake.auth.sessionId));

    await this.officeService.handleConnection(
      this.server,
      client,
      jwtAccessToken,
      sessionId,
    );
  }

  async registerSubscribe() {
    this.messageHandler.registerHandler(
      NATS_EVENTS.CREATE_OFFICE,
      async (roomCode) => {
        this.server.to(String(roomCode)).emit(
          OFFICE_SOCKET_S_MESSAGE.S_OFFICE_QUEUE_START,
          JSON.stringify({
            code: SOCKET_SERVER_ERROR_CODE_GLOBAL.OFFICE_RESERVATION_ROOM_CREATE,
          }),
        );
      },
    );

    this.messageHandler.registerHandler(
      NATS_EVENTS.DELETE_OFFICE,
      async (roomCode) => {
        this.server.to(String(roomCode)).emit(
          OFFICE_SOCKET_S_MESSAGE.S_OFFICE_QUEUE_DELETE,
          JSON.stringify({
            code: SOCKET_SERVER_ERROR_CODE_GLOBAL.OFFICE_RESERVATION_ROOM_DELETE,
          }),
        );
      },
    );
  }

  async handleDisconnect(client: Socket) {
    await this.officeService.officeQueueExit(client);
  }

  // 오피스 예약 하기
  @SubscribeMessage(OFFICE_SOCKET_C_MESSAGE.C_OFFICE_QUEUE_REGISTER)
  async officeQueueRegister(client: Socket, roomCode: string) {
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );

    await this.officeService.officeQueueRegister(
      client,
      jwtAccessToken,
      roomCode,
    );
  }

  @SubscribeMessage(OFFICE_SOCKET_C_MESSAGE.C_OFFICE_QUEUE_EXIT)
  async officeQueueExit(client: Socket) {
    await this.officeService.officeQueueExit(client);
  }
}
