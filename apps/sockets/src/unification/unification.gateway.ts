import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';
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
import { UnificationService } from './unification.service';
import { GatewayInitiService } from '../services/gateway-init.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import {
  CHAT_SOCKET_S_MESSAGE,
  CHATTING_SOCKET_C_GLOBAL,
  FRIEND_SOCKET_S_MESSAGE,
  NAMESPACE,
  NATS_EVENTS,
  OFFICE_SOCKET_S_MESSAGE,
  SCREEN_BANNER_SOCKET_S_MESSAGE,
  SOCKET_C_GLOBAL,
  SOCKET_S_GLOBAL,
  SOCKET_SERVER_ERROR_CODE_GLOBAL,
} from '@libs/constants';
import { PlayerService } from '../player/player.service';
import { RequestPayload } from '../packets/packet-interface';
import { ChatService } from '../chat/chat.service';
import { ScreenBannerService } from '../screen-banner/screen-banner.service';
import { MyRoomService } from '../my-room/my-room.service';
import { FriendService } from '../friend/friend.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { OfficeService } from '../office/office.service';
import { HubSocketService } from '../hub-socket/hub-socket.service';
import { CustomSocket } from '../interfaces/custom-socket';
import { CommonService } from '../common/common.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  pingInterval: 30000, //30초마다 클라이언트에게 ping을 보냄
  pingTimeout: 30000, //클라이언트로부터 ping을 30초동안 받지 못하면 연결 해제
})
@Injectable()
export class UnificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly unificationService: UnificationService,
    private readonly gatewayInitService: GatewayInitiService,
    private readonly playerService: PlayerService,
    private readonly chatService: ChatService,
    private readonly screenBannerService: ScreenBannerService,
    private readonly friendService: FriendService,
    private readonly myRoomService: MyRoomService,
    private readonly blockchainService: BlockchainService,
    private readonly officeService: OfficeService,
    private readonly commonService: CommonService,
    private readonly socketService: HubSocketService,
    private readonly messageHandler: NatsMessageHandler,
  ) {}
  private readonly logger = new Logger(UnificationGateway.name);
  @WebSocketServer()
  private server: Server;

  getServer() {
    return this.server;
  }

  private gatewayId;

  public getGatewayId(): string {
    return this.gatewayId;
  }

  async afterInit() {
    const isInitialized = await this.gatewayInitService.initializeGateway(
      NAMESPACE.UNIFICATION,
      this.logger,
    );

    if (!isInitialized) {
      this.logger.debug('Unification 서버가 실행되었어요.✅');
    }

    this.gatewayId = `${NAMESPACE.PLAYER}:${uuidv4()}`;
    this.socketService.handleConnectionHub(this.gatewayId);
    await this.setServer();
  }

  //소켓 연결
  async handleConnection(client: CustomSocket) {
    this.logger.debug('Unification 소켓 연결중.✅');

    try {
      await this.unificationService.handleConnection(this.server, client);
      await this.socketService.handleConnection(client);

      await this.initRegisterSubscribe(client);
    } catch (error) {
      this.logger.error(`소켓 연결 처리 중 오류 발생: ${error.message}`);
      client.emit(
        SOCKET_S_GLOBAL.ERROR,
        SOCKET_SERVER_ERROR_CODE_GLOBAL.TOKEN_ERROR,
      );
      client.disconnect();
    }
  }

  async initRegisterSubscribe(client: CustomSocket) {
    // 중복 로그인 알림 구독
    this.logger.debug(
      '중복 로그인 알림 구독.✅ : sessionId - ',
      client.data.sessionId,
    );
    this.messageHandler.registerHandler(
      `${NATS_EVENTS.DUPLICATE_LOGIN_USER}:${client.data.sessionId}`,
      async (sessionId) => {
        // 서버에서 소켓 연결 제거
        this.logger.debug('중복 로그인 감지');
        console.log('sessionId: ', sessionId);

        const sockets = await this.server.in(sessionId).fetchSockets();

        sockets.forEach((socket) => {
          socket.emit(SOCKET_S_GLOBAL.S_DROP_PLAYER, 10000);
          socket.disconnect(true);
        });
        console.log('sockets: ', sockets);
      },
    );

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

    // 사용자 전용 룸 구독
    this.messageHandler.registerHandler(
      client.data.memberId,
      async (message) => {
        this.logger.debug('사용자 전용 룸 구독 💠');

        const data = JSON.parse(message);
        switch (data.packet.eventName) {
          case CHAT_SOCKET_S_MESSAGE.S_SEND_DIRECT_MESSAGE:
            await this.chatService.sendToReceiverDirectMessage(message);
            break;
          case FRIEND_SOCKET_S_MESSAGE.S_FRIEND_BRING:
            await this.friendService.sendTofriendsBring(message);
            break;
          default:
            this.logger.debug('사용자 전용 룸 구독 잘못된 패킷 입니다.');
            client.emit(SOCKET_S_GLOBAL.ERROR, '잘못된 패킷 입니다.');
            break;
        }
      },
    );

    // 스크린 배너 정보 보내기
    const bannerList = await this.screenBannerService.getBannerList(
      JSON.stringify({ type: 'SELECT' }),
    );
    const screenList = await this.screenBannerService.getScreenList(
      JSON.stringify({ type: 'SELECT' }),
    );

    client.emit(
      SCREEN_BANNER_SOCKET_S_MESSAGE.S_SCREEN_LIST,
      JSON.stringify(screenList),
    );

    client.emit(
      SCREEN_BANNER_SOCKET_S_MESSAGE.S_BANNER_LIST,
      JSON.stringify(bannerList),
    );
  }

  async setServer() {
    await this.unificationService.setServer(this.server);
    await this.chatService.setServer(this.server);
    await this.playerService.setServer(this.server);
    await this.myRoomService.setServer(this.server);
    await this.officeService.setServer(this.server);
    await this.friendService.setServer(this.server);
    await this.commonService.setServer(this.server);
  }

  //소켓 해제
  async handleDisconnect(client: CustomSocket) {
    await this.unificationService.handleDisconnect(client);

    this.logger.debug('disonnected', client.id);
    this.logger.debug(`${client.data.memberId} 소켓 연결 해제 ❌`);
  }

  // 닉네임 변경 요청
  @SubscribeMessage(CHATTING_SOCKET_C_GLOBAL.C_CHANGE_NICKNAME)
  async debugMessage(client: CustomSocket) {
    return this.unificationService.nicknameChange(client);
  }

  @SubscribeMessage(SOCKET_C_GLOBAL.C_REQUEST)
  async request(client: CustomSocket, payload: RequestPayload) {
    switch (payload.type) {
      case NAMESPACE.UNIFICATION:
        await this.unificationService.handleRequestMessage(client, payload);
        break;
      case NAMESPACE.CHAT:
        await this.chatService.handleRequestMessage(client, payload);
        break;
      case NAMESPACE.PLAYER:
        await this.playerService.handleRequestMessage(client, payload);
        break;
      case NAMESPACE.SCREEN_BANNER:
        await this.screenBannerService.handleRequestMessage(client, payload);
        break;
      case NAMESPACE.MY_ROOM:
        await this.myRoomService.handleRequestMessage(client, payload);
        break;
      case NAMESPACE.FRIEND:
        await this.friendService.handleRequestMessage(client, payload);
        break;
      case NAMESPACE.BLOCKCHAIN:
        await this.blockchainService.setServer(this.server);
        break;
      case NAMESPACE.OFFICE:
        await this.officeService.handleRequestMessage(client, payload);
        break;
      case NAMESPACE.COMMON:
        await this.commonService.handleRequestMessage(client, payload);
        break;
      default:
        this.logger.debug('잘못된 type의 패킷 입니다.');
        console.log(payload);
        client.emit(SOCKET_S_GLOBAL.ERROR, '잘못된 type의 패킷 입니다.');
        break;
    }
  }
}
