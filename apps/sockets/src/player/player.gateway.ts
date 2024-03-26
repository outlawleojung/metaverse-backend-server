import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
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
import { NatsService } from '../nats/nats.service';
import {
  PLAYER_SOCKET_C_MESSAGE,
  NAMESPACE,
  NATS_EVENTS,
} from '@libs/constants';
import {
  C_BASE_INSTANTIATE_OBJECT,
  C_BASE_SET_ANIMATION,
  C_BASE_SET_EMOJI,
  C_BASE_SET_TRANSFORM,
  C_ENTER,
} from './packets/packet';
import { RoomService } from '../room/room.service';
import { GameObjectService } from './game/game-object.service';
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

  private readonly logger = new Logger(PlayerGateway.name);
  constructor(
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
    private readonly gameObjectService: GameObjectService,
    private roomService: RoomService,
    private readonly gatewayInitService: GatewayInitiService,
    private readonly natsService: NatsService,
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

    this.natsService.on(NATS_EVENTS.NATS_CONNECTED, async () => {
      // 룸 생성 구독
    });
  }

  async handleConnection(client: Socket) {
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );
    const sessionId = String(Decrypt(client.handshake.auth.sessionId));
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

    await this.playerService.joinRoom(client, jwtAccessToken, packet);
  }

  // 클라이언트 목록 요청
  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_GET_CLIENT)
  async getClient(client: Socket) {
    await this.playerService.getClient(client);
  }

  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_BASE_INSTANTIATE_OBJECT)
  async getInstantiateObject(
    client: Socket,
    packet: C_BASE_INSTANTIATE_OBJECT,
  ) {
    await this.playerService.getInstantiateObject(this.server, client, packet);
  }

  @SubscribeMessage(PLAYER_SOCKET_C_MESSAGE.C_BASE_GET_OBJECT)
  async getObject(client: Socket) {
    this.logger.debug('C_BASE_GET_OBJECT : ', client.data.memberId);
    await this.gameObjectService.getObjects(client);
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

  // @SubscribeMessage('C_GET_ROOM')
  // async getRoom(client: Socket) {
  //   const rooms = await this.roomService.getRooms();
  //   this.logger.debug('룸 리스트 : ', JSON.stringify(rooms));
  // }

  // @SubscribeMessage('C_CREATE_ROOM')
  // async creatRoom(client: Socket) {
  //   const rooms = await this.roomService.createRoom(RoomType.MyRoom);
  //   this.logger.debug('룸 생성 : ', JSON.stringify(rooms));
  // }
}
