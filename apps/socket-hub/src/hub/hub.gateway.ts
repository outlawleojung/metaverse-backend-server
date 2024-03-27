import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { HubService } from './hub.service';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { HUB_SOCKET_C_MESSAGE } from '@libs/constants';

@WebSocketGateway({
  pingInterval: 30000, //30초마다 클라이언트에게 ping을 보냄
  pingTimeout: 30000, //클라이언트로부터 ping을 30초동안 받지 못하면 연결 해제
})
export class HubGateway {
  @WebSocketServer()
  private server: Server;
  getServer() {
    return this.server;
  }

  constructor(
    @Inject(forwardRef(() => HubService))
    private readonly hubService: HubService,
  ) {}

  private readonly logger = new Logger(HubGateway.name);

  async afterInit() {
    this.logger.debug(`허브 서버 실행 ✅`);
  }

  async handleConnection(client: Socket) {
    const gatewayId = Array.isArray(client.handshake.query.gatewayId)
      ? client.handshake.query.gatewayId[0]
      : client.handshake.query.gatewayId;

    await this.hubService.handleConnection(client, gatewayId);
  }

  async handleDisconnect(client: Socket) {
    await this.hubService.handleDisconnect(client);
  }

  // 게이트웨이에서 GameObject목록 요청
  @SubscribeMessage(HUB_SOCKET_C_MESSAGE.C_GET_GAMEOBJECTS)
  async getGameObjects(client: Socket, packet: string) {
    await this.hubService.getGameObjects(client, packet);
  }

  // 게이트웨이에서 보낸 GameObject 목록
  @SubscribeMessage(HUB_SOCKET_C_MESSAGE.C_SEND_GAMEOBJECTS)
  async setGameObjects(client: Socket, packet: string) {
    await this.hubService.setGameObjects(client, packet);
  }
}
