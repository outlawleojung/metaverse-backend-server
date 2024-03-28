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
  C_BASE_SET_ANIMATION_ONCE,
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
    await this.playerService.handleConnection(this.server, client);
  }

  async handleDisconnect(client: Socket) {
    await this.playerService.handleDisconnect(client);
  }

  // 룸 입장
  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_ENTER)
  async enterChatRoom(client: Socket, packet: C_ENTER) {
    await this.playerService.joinRoom(client, packet);
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
    await this.playerService.getObjects(client);
  }

  // 이동 동기화
  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_TRANSFORM)
  async baseSetTransform(client: Socket, data: C_BASE_SET_TRANSFORM) {
    await this.playerService.baseSetTransform(client, data);
    this.logger.debug(
      '플레이어 이동 동기화 클라이언트 데이터 : ',
      JSON.stringify(client.data),
    );
    this.logger.debug('플레이어 이동 동기화 데이터 : ', JSON.stringify(data));
  }

  // 애니메이션 동기화
  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_ANIMATION)
  async baseSetAnimation(client: Socket, data: C_BASE_SET_ANIMATION) {
    await this.playerService.baseSetAnimation(client, data);
    this.logger.debug(
      '플레이어 애니메이션 동기화 데이터 : ',
      JSON.stringify(data),
    );
  }

  // 이모지 동기화
  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_ANIMATION_ONCE)
  async baseSetEmoji(client: Socket, data: C_BASE_SET_ANIMATION_ONCE) {
    await this.playerService.baseSetAnimationOnce(client, data);
    this.logger.debug('플레이어 이모지 동기화 데이터 : ', JSON.stringify(data));
  }

  // 인터랙션 조회
  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_INTERACTION_GET_ITEMS)
  async getInteraction(client: Socket) {
    await this.playerService.getInteration(client);
    // this.logger.debug('인터랙션 조회 : ', JSON.stringify(data));
  }
}
