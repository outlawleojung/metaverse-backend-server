import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Inject, Logger, forwardRef } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { GatewayInitiService } from '../services/gateway-init.service';
import { NatsService } from '../nats/nats.service';
import { Decrypt } from '@libs/common';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import {
  CHATTING_SOCKET_C_MESSAGE,
  NAMESPACE,
  NATS_EVENTS,
} from '@libs/constants';

@WebSocketGateway({
  namespace: NAMESPACE.CHAT,
  pingInterval: 30000, //30초마다 클라이언트에게 ping을 보냄
  pingTimeout: 30000, //클라이언트로부터 ping을 30초동안 받지 못하면 연결 해제
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly gatewayInitService: GatewayInitiService,
    private readonly natsService: NatsService,
    private readonly messageHandler: NatsMessageHandler,
  ) {}
  private readonly logger = new Logger(ChatGateway.name);

  async afterInit() {
    const isInitialized = await this.gatewayInitService.initializeGateway(
      NAMESPACE.CHAT,
      this.logger,
    );

    if (!isInitialized) {
      // 초기화 작업 수행
      this.logger.debug(`채팅 서버 실행 ✅`);
    }

    await this.natsService.on(NATS_EVENTS.NATS_CONNECTED, async () => {
      // 룸에 입장 정보 구독
      await this.messageHandler.registerHandler(
        NATS_EVENTS.JOIN_ROOM,
        async (data) => {
          // 룸 입장
          this.chatService.joinRoom(data);
        },
      );
    });
  }

  async handleConnection(client: Socket) {
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );
    const sessionId = String(Decrypt(client.handshake.auth.sessionId));

    await this.chatService.handleConnection(
      this.server,
      client,
      jwtAccessToken,
      sessionId,
    );
  }

  async handleDisconnect(client: Socket) {
    await this.chatService.handleDisconnect(client);
  }

  //메시지가 전송되면 모든 유저에게 메시지 전송
  @SubscribeMessage(CHATTING_SOCKET_C_MESSAGE.C_SEND_MESSAGE)
  async sendMessage(
    client: Socket,
    messageInfo: {
      message: string;
      roomCode: string;
      roomName: string;
      color: string;
    },
  ) {
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );

    return this.chatService.sendMessage(
      client,
      jwtAccessToken,
      messageInfo.message,
      messageInfo?.roomCode,
      messageInfo?.roomName,
      messageInfo.color,
    );
  }

  // 월드 DM이 전송되면 특정 유저에게 메시지 전송
  @SubscribeMessage(CHATTING_SOCKET_C_MESSAGE.C_SEND_DIRECT_MESSAGE)
  async sendDirectMessage(
    client: Socket,
    payload: {
      recvNickName: string;
      message: string;
      color: string;
    },
  ) {
    return this.chatService.sendDirectMessage(client, payload);
  }

  // 친구 DM이 전송되면 친구 에게 메시지 전송
  @SubscribeMessage(CHATTING_SOCKET_C_MESSAGE.C_SEND_FRIEND_DIRECT_MESSAGE)
  async sendFriendDirectMessage(
    client: Socket,
    payload: { targetMemberId: string; message: string },
  ) {
    return this.chatService.sendFriendDirectMessage(
      client,
      payload.targetMemberId,
      payload.message,
    );
  }
}
