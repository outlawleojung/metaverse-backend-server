import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { v4 as uuidv4 } from 'uuid';
import { PlayerService } from './player.service';
import {
  Inject,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
  forwardRef,
} from '@nestjs/common';
import { GatewayInitiService } from '../services/gateway-init.service';
import { Server, Socket } from 'socket.io';
import { Decrypt } from '@libs/common';
import { PLAYER_SOCKET_C_MESSAGE, NAMESPACE } from '@libs/constants';
import {
  C_BASE_INSTANTIATE_OBJECT,
  C_BASE_SET_ANIMATION,
  C_BASE_SET_EMOJI,
  C_BASE_SET_TRANSFORM,
  C_ENTER,
} from './packets/packet';
import { WsExceptionFilter } from '../ws-exception.filter';

@WebSocketGateway({
  namespace: NAMESPACE.PLAYER,
  pingInterval: 30000, //30초마다 클라이언트에게 ping을 보냄
  pingTimeout: 30000, //클라이언트로부터 ping을 30초동안 받지 못하면 연결 해제
})
@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(new WsExceptionFilter())
export class PlayerGateway {
  @WebSocketServer()
  private server: Server;

  public getServer(): Server {
    return this.server;
  }

  private gatewayId;

  public getGatewayId(): string {
    return this.gatewayId;
  }

  private readonly logger = new Logger(PlayerGateway.name);
  constructor(
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
    private readonly gatewayInitService: GatewayInitiService,
  ) {}

  async afterInit() {
    const isInitialized = await this.gatewayInitService.initializeGateway(
      NAMESPACE.PLAYER,
      this.logger,
    );

    if (!isInitialized) {
      // 초기화 작업 수행
      this.logger.debug(`동기화 서버 실행 ✅`);
    }

    this.gatewayId = `${NAMESPACE.PLAYER}:${uuidv4()}`;

    this.playerService.handleConnectionHub(this.gatewayId);
  }

  async handleConnection(client: Socket) {
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );
    const sessionId = String(Decrypt(client.handshake.auth.sessionId));

    console.log(jwtAccessToken);
    // const jwtAccessToken = String(
    //   Decrypt(client.handshake.headers.authorization),
    // );
    // const sessionId = String(Decrypt(client.handshake.headers.cookie));

    await this.playerService.handleConnection(
      this.server,
      client,
      jwtAccessToken,
      sessionId,
    );
  }

  async handleDisconnect(client: Socket) {
    await this.playerService.handleDisconnect(client);
  }

  // 룸 입장
  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_ENTER)
  async enterChatRoom(client: Socket, packet: C_ENTER) {
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );

    // const jwtAccessToken = String(
    //   Decrypt(client.handshake.headers.authorization),
    // );

    await this.playerService.joinRoom(client, jwtAccessToken, packet);
  }

  // 클라이언트 목록 요청
  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_GET_CLIENT)
  async getClient(client: Socket) {
    await this.playerService.getClient(client);
  }

  // 게임오브젝트 인스턴스 생성
  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_BASE_INSTANTIATE_OBJECT)
  async getInstantiateObject(
    client: Socket,
    packet: C_BASE_INSTANTIATE_OBJECT,
  ) {
    await this.playerService.getInstantiateObject(this.server, client, packet);
  }

  // 게임오브젝트 목록 조회
  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_BASE_GET_OBJECT)
  async getGameObjects(client: Socket) {
    this.logger.debug('C_BASE_GET_OBJECT : ', client.data.memberId);

    // const payload: GetGameObjectInfo = {
    //   memberId: client.data.memberId,
    //   gatewayId: this.gatewayId,
    // };
    // await this.messageHandler.publishHandler(
    //   NATS_EVENTS.REQ_GET_GAMEOBJECTS,
    //   JSON.stringify(payload),
    // );

    // setTimeout(async () => {
    //   const gameObjects: GameObject[] = this.gameObjects.get(
    //     client.data.memberId,
    //   );
    //   console.log(
    //     '#################################### gameObjects: ',
    //     this.gameObjects,
    //   );
    //   client.emit(PLAYER_SOCKET_S_MESSAGE.S_BASE_ADD_OBJECT, gameObjects);
    //   this.gameObjects.delete(client.data.memberId);
    // }, 5000);

    await this.playerService.getObjects(client);
  }

  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_TRANSFORM)
  async baseSetTransform(client: Socket, data: C_BASE_SET_TRANSFORM) {
    this.playerService.baseSetTransform(client, data);
    this.logger.debug('플레이어 이동 동기화 데이터 : ', JSON.stringify(data));
  }

  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_ANIMATION)
  async baseSetAnimation(client: Socket, data: C_BASE_SET_ANIMATION) {
    this.playerService.baseSetAnimation(client, data);
    this.logger.debug(
      '플레이어 애니메이션 동기화 데이터 : ',
      JSON.stringify(data),
    );
  }

  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_EMOJI)
  async baseSetEmoji(client: Socket, data: C_BASE_SET_EMOJI) {
    this.playerService.baseSetEmoji(client, data);
    this.logger.debug('플레이어 이모지 동기화 데이터 : ', JSON.stringify(data));
  }
}
