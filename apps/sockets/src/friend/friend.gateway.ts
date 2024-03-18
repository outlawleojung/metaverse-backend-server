import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendService } from './friend.service';
import { GatewayInitiService } from '../services/gateway-init.service';
import { Decrypt } from '@libs/common';
import { FRIEND_SOCKET_C_MESSAGE, NAMESPACE } from '../constants/constants';

@WebSocketGateway({
  namespace: NAMESPACE.FRIEND,
  pingInterval: 30000, //30초마다 클라이언트에게 ping을 보냄
  pingTimeout: 30000, //클라이언트로부터 ping을 30초동안 받지 못하면 연결 해제
})
export class FriendGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly friendService: FriendService,
    private readonly gatewayInitService: GatewayInitiService,
  ) {}
  private readonly logger = new Logger(FriendGateway.name);

  async afterInit() {
    const isInitialized = await this.gatewayInitService.initializeGateway(
      NAMESPACE.FRIEND,
      this.logger,
    );

    if (!isInitialized) {
      this.logger.debug('친구 서버가 실행되었어요.✅');
    }
  }

  async handleConnection(client: Socket) {
    const jwtAccessToken = String(
      Decrypt(client.handshake.auth.jwtAccessToken),
    );
    const sessionId = String(Decrypt(client.handshake.auth.sessionId));

    await this.friendService.handleConnection(
      this.server,
      client,
      jwtAccessToken,
      sessionId,
    );
  }

  async handleDisconnect(client: Socket) {
    this.logger.debug('친구 서버 연결 해제 ❌ : ', client.id);
  }

  @SubscribeMessage(FRIEND_SOCKET_C_MESSAGE.C_FRIEND_LIST)
  async handleGetFriends(client: Socket) {
    await this.friendService.getFriends(client);
  }

  @SubscribeMessage(FRIEND_SOCKET_C_MESSAGE.C_FRIEND_FOLLOW)
  async handleFriendsFollow(client: Socket, friendMemberId: string) {
    await this.friendService.friendsFollow(client, friendMemberId);
  }

  @SubscribeMessage(FRIEND_SOCKET_C_MESSAGE.C_FRIEND_BRING)
  async handleFriendsBring(client: Socket, friendMemberId: string) {
    await this.friendService.friendsBring(client, friendMemberId);
  }
}
