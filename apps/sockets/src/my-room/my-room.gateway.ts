import { C_MYROOM_END_EDIT } from './../packets/myroom-packet';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MyRoomService } from './my-room.service';
import {
  MY_ROOM_SOCKET_C_MESSAGE,
  NAMESPACE,
  NATS_EVENTS,
} from '@libs/constants';
import {
  forwardRef,
  Inject,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsExceptionFilter } from '../ws-exception.filter';
import { GatewayInitiService } from '../services/gateway-init.service';
import { Server, Socket } from 'socket.io';
import { C_MYROOM_KICK, C_MYROOM_SHUTDOWN } from '../packets/myroom-packet';
import { NatsService } from '../nats/nats.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';

@WebSocketGateway({
  namespace: NAMESPACE.MY_ROOM,
  pingInterval: 30000, //30초마다 클라이언트에게 ping을 보냄
  pingTimeout: 30000, //클라이언트로부터 ping을 30초동안 받지 못하면 연결 해제
})
@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(new WsExceptionFilter())
export class MyRoomGateway {
  @WebSocketServer()
  private server: Server;

  public getServer(): Server {
    return this.server;
  }

  private readonly logger = new Logger(MyRoomGateway.name);
  constructor(
    @Inject(forwardRef(() => MyRoomService))
    private readonly myRoomService: MyRoomService,
    private readonly gatewayInitService: GatewayInitiService,
    private readonly natsService: NatsService,
    private readonly messageHandler: NatsMessageHandler,
  ) {}

  async afterInit() {
    const isInitialized = await this.gatewayInitService.initializeGateway(
      NAMESPACE.PLAYER,
      this.logger,
    );

    if (!isInitialized) {
      // 초기화 작업 수행
      this.logger.debug(`마이룸 서버 실행 ✅`);
    }

    await this.natsService.on(NATS_EVENTS.NATS_CONNECTED, async () => {
      // 룸에 입장 정보 구독
      this.logger.debug(`마이룸에서 동기화 서버 룸 입장 정보 구독 ✅`);
      await this.messageHandler.registerHandler(
        NATS_EVENTS.JOIN_ROOM,
        async (data) => {
          // 룸 입장
          this.myRoomService.joinRoom(data);
        },
      );
    });
  }

  async handleConnection(client: Socket) {
    await this.myRoomService.handleConnection(client);
  }

  async handleDisconnect(client: Socket) {
    await this.myRoomService.handleDisconnect(client);
  }

  @SubscribeMessage(MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_GET_ROOMINFO)
  async getRoomInfo(client: Socket) {
    await this.myRoomService.getRoomInfo(client);
  }

  @SubscribeMessage(MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_START_EDIT)
  async startEdit(client: Socket) {
    await this.myRoomService.startEdit(client);
  }

  @SubscribeMessage(MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_END_EDIT)
  async endEdit(client: Socket, packet: C_MYROOM_END_EDIT) {
    await this.myRoomService.endEdit(client, packet);
  }

  @SubscribeMessage(MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_KICK)
  async kick(client: Socket, packet: C_MYROOM_KICK) {
    await this.myRoomService.kick(client, packet);
  }

  @SubscribeMessage(MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_SHUTDOWN)
  async shutDown(client: Socket, packet: C_MYROOM_SHUTDOWN) {
    await this.myRoomService.shutDown(client, packet);
  }
}
