import {
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, Logger, forwardRef } from '@nestjs/common';
import { ScreenBannerService } from './screen-banner.service';
import { Server, Socket } from 'socket.io';
import { NatsService } from '../nats/nats.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { GatewayInitiService } from '../services/gateway-init.service';
import { Decrypt } from '@libs/common';
import { NAMESPACE, NATS_EVENTS } from '../constants/constants';

@WebSocketGateway({
  namespace: NAMESPACE.SCREEN_BANNER,
  pingInterval: 30000, //10초마다 클라이언트에게 ping을 보냄
  pingTimeout: 30000, //클라이언트로부터 ping을 5초동안 받지 못하면 연결 해제
})
export class ScreenBannerGateway {
  @WebSocketServer()
  private server: Server;
  public getServer(): Server {
    return this.server;
  }

  private readonly logger = new Logger(ScreenBannerGateway.name);

  constructor(
    @Inject(forwardRef(() => ScreenBannerService))
    private screenBannerService: ScreenBannerService,
    private readonly natsService: NatsService,
    private readonly gatewayInitService: GatewayInitiService,
  ) {}

  async afterInit() {
    const isInitialized = await this.gatewayInitService.initializeGateway(
      NAMESPACE.SCREEN_BANNER,
      this.logger,
    );

    if (!isInitialized) {
      this.logger.debug(`스크린 배너 서버 실행 ✅`);
    }

    this.natsService.on(NATS_EVENTS.NATS_CONNECTED, async () => {
      await this.screenBannerService.registerSubscribe();
    });
  }

  // 연결
  async handleConnection(@ConnectedSocket() client: Socket) {
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );
    const sessionId = String(Decrypt(client.handshake.auth.sessionId));

    await this.screenBannerService.handleConnection(
      this.server,
      client,
      jwtAccessToken,
      sessionId,
    );
  }

  async handleDisconnect(client: Socket) {
    this.logger.debug(`스크린 배너 서버 연결 해제 실행 ❌ : `, client.id);
  }
}
