import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import { TokenCheckService } from '../unification/auth/tocket-check.service';
import {
  C_MYROOM_END_EDIT,
  C_MYROOM_KICK,
  C_MYROOM_SHUTDOWN,
  S_MYROOM_END_EDIT,
  S_MYROOM_GET_ROOMINFO,
  S_MYROOM_KICK,
} from '../packets/myroom-packet';
import {
  MY_ROOM_SOCKET_C_MESSAGE,
  MY_ROOM_SOCKET_S_MESSAGE,
  NATS_EVENTS,
  RedisKey,
  SOCKET_S_GLOBAL,
} from '@libs/constants';
import { RoomType } from '../room/room-type';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { RequestPayload } from '../packets/packet-interface';

@Injectable()
export class MyRoomService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly tokenCheckService: TokenCheckService,
    private readonly messageHandler: NatsMessageHandler,
  ) {}

  private readonly logger = new Logger(MyRoomService.name);

  private server: Server;
  async setServer(server: Server) {
    this.server = server;
  }

  private socketMap = new Map();
  getSocket(clientId: string) {
    if (this.socketMap.has(clientId)) {
      return this.socketMap.get(clientId);
    }
  }

  async handleRequestMessage(client: Socket, payload: RequestPayload) {
    switch (payload.event) {
      case MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_GET_ROOMINFO:
        await this.getRoomInfo(client);
        break;
      case MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_START_EDIT:
        await this.startEdit(client);
        break;
      case MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_END_EDIT:
        await this.endEdit(client, payload.data as C_MYROOM_END_EDIT);
        break;
      case MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_KICK:
        await this.kick(client, payload.data as C_MYROOM_KICK);
        break;
      case MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_SHUTDOWN:
        await this.shutDown(client, payload.data as C_MYROOM_SHUTDOWN);
        break;
      default:
        break;
    }
  }

  // // 소켓 연결
  // async handleConnection(client: Socket) {
  //   const authInfo =
  //     await this.tokenCheckService.getJwtAccessTokenAndSessionId(client);

  //   const jwtAccessToken = authInfo.jwtAccessToken;
  //   const sessionId = authInfo.sessionId;

  //   const memberInfo =
  //     await this.tokenCheckService.checkLoginToken(jwtAccessToken);

  //   // 해당 멤버가 존재하지 않을 경우 연결 종료
  //   if (!memberInfo) {
  //     client.disconnect();
  //     return;
  //   }

  //   console.log(memberInfo);
  //   const memberId = memberInfo.memberId;

  //   client.join(memberId);
  //   client.join(sessionId);

  //   // 클라이언트 데이터 설정
  //   client.data.memberId = memberId;
  //   client.data.sessionId = sessionId;
  //   client.data.jwtAccessToken;
  //   client.data.clientId = memberInfo.memberCode;

  //   this.socketMap.set(memberInfo.memberCode, client);

  //   this.logger.debug(
  //     `마이룸 서버에 연결되었어요 ✅ : ${memberId} - sessionId : ${sessionId}`,
  //   );
  // }

  // async handleDisconnect(client: Socket) {
  //   this.logger.debug(
  //     `마이룸 서버가 해제되었어요 ❌ : ${client.data.memberId} `,
  //   );
  // }

  // 방 입장
  async joinRoom(message: string) {
    const roomInfo = JSON.parse(message);
    const roomId: string = roomInfo.roomId;
    const redisRoomId = RedisKey.getStrRoomId(roomId);
    const memberId = roomInfo.memberId;

    const isMyRoom = await this.isMyRoom(redisRoomId);

    if (isMyRoom) {
      try {
        const socketInfo = await this.redisClient.get(
          RedisKey.getStrMemberSocket(memberId),
        );

        const socketData = JSON.parse(socketInfo);

        const socket: Socket = await this.getSocket(socketData.clientId);

        if (socket) {
          socket.data.roomName = roomInfo?.roomName;
          socket.data.roomCode = roomInfo?.roomCode;
          socket.data.sceneName = roomInfo.sceneName;
          socket.data.roomId = redisRoomId;
          socket.join(redisRoomId);

          this.logger.debug('마이룸 서버 룸 입장.🆗 : ', redisRoomId);

          // 룸 구독
          await this.messageHandler.registerHandler(
            `${NATS_EVENTS.MY_ROOM}.${redisRoomId}`,
            async (message) => {
              const data = JSON.parse(message);
              this.server.to(redisRoomId).emit(data.event, data.message);
            },
          );

          // 룸에 퇴장 정보 구독
          await this.messageHandler.registerHandler(
            `${NATS_EVENTS.LEAVE_ROOM}:${memberId}`,
            async (data) => {
              // 룸 퇴장
              // await this.leaveRoom(data);
            },
          );
        }
      } catch (error) {
        this.logger.debug('마이룸 서버 룸 입장 실패.❌ : ', redisRoomId);
        this.logger.debug({ error });
      }
    }
  }

  async getRoomInfo(client: Socket) {
    const memberId = client.data.memberId;

    // 사용자가 입장 한 룸 정보 가져오기
    const socketData = await this.redisClient.get(
      RedisKey.getStrMemberSocket(memberId),
    );

    if (!socketData) {
      return client.emit(SOCKET_S_GLOBAL.ERROR, '소켓 정보가 없음');
    }

    const socketDataObj = JSON.parse(socketData);

    if (!socketDataObj.roomId) {
      return client.emit(SOCKET_S_GLOBAL.ERROR, '입장한 룸이 없음');
    }

    const redisRoomId = socketDataObj.roomId;

    // 전체 마이룸 정보 가져오기
    const myRoomInfos = await this.redisClient.smembers(
      RedisKey.getRoomsByType(RoomType.MyRoom),
    );

    let isConnected = false;
    for (const myRoom of myRoomInfos) {
      if (myRoom === socketDataObj.roomId) {
        isConnected = true;
        break;
      }
    }

    if (!isConnected) {
      return client.emit(SOCKET_S_GLOBAL.ERROR, '입장한 마이룸이 없음');
    }

    const roomData = JSON.parse(
      await this.redisClient.hget(RedisKey.getStrRooms(), redisRoomId),
    );

    const packet = new S_MYROOM_GET_ROOMINFO();
    packet.ownerId = roomData.ownerId;
    packet.ownerNickname = roomData.ownerNickname;
    packet.isShutdown = roomData.isShutdown;
    packet.ownerAvatarInfo = roomData.ownerAvatarInfo;

    const { event, ...packetData } = packet;
    return client.emit(event, packetData);
  }

  async startEdit(client: Socket) {
    const memberId = client.data.memberId;
    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);
    const redisRoomId = await this.redisClient.get(memberKey);
    const clientId = client.data.clientId;

    const isOwner = await this.isMyRoomOwner(clientId, redisRoomId);

    if (!isOwner) {
      return client.emit(SOCKET_S_GLOBAL.ERROR, '마이룸 오너가 아닙니다.');
    }

    const response = {
      event: MY_ROOM_SOCKET_S_MESSAGE.S_MYROOM_START_EDIT,
      message: '',
    };

    this.logger.debug('마이룸 편집 이벤트 발행');
    this.messageHandler.publishHandler(
      `${NATS_EVENTS.MY_ROOM}.${redisRoomId}`,
      JSON.stringify(response),
    );
  }

  async endEdit(client: Socket, packet: C_MYROOM_END_EDIT) {
    const memberId = client.data.memberId;
    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);
    const redisRoomId = await this.redisClient.get(memberKey);
    const clientId = client.data.clientId;
    const isChanged = packet.isChanged;

    const isOwner = await this.isMyRoomOwner(clientId, redisRoomId);

    if (!isOwner) {
      return client.emit(SOCKET_S_GLOBAL.ERROR, '마이룸 오너가 아닙니다.');
    }

    const _packet = new S_MYROOM_END_EDIT();
    _packet.isChanged = isChanged;

    const { event, ...message } = _packet;

    const response = {
      event,
      message,
    };

    this.logger.debug('마이룸 편집 종료 이벤트 발행');
    this.messageHandler.publishHandler(
      `${NATS_EVENTS.MY_ROOM}.${redisRoomId}`,
      JSON.stringify(response),
    );
  }

  async kick(client: Socket, packet: C_MYROOM_KICK) {
    const memberId = client.data.memberId;
    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);
    const redisRoomId = await this.redisClient.get(memberKey);
    const clientId = client.data.clientId;

    const isOwner = await this.isMyRoomOwner(clientId, redisRoomId);

    if (!isOwner) {
      return client.emit(SOCKET_S_GLOBAL.ERROR, '마이룸 오너가 아닙니다.');
    }

    console.log(packet);
    const _packet = new S_MYROOM_KICK();

    // const kickSocket = this.getSocket(packet.clientId);
    // if (!kickSocket) {
    //   _packet.success = false;

    //   const { event, ...message } = _packet;
    //   return client.emit(event, message);
    // }

    _packet.success = true;

    const { event, ...message } = _packet;
    client.emit(event, message);

    this.logger.debug('마이룸 편집 종료 이벤트 발행');
    this.messageHandler.publishHandler(
      `${NATS_EVENTS.MY_ROOM}.${redisRoomId}`,
      // JSON.stringify(response),
      '',
    );
  }

  async shutDown(client: Socket, packet: C_MYROOM_SHUTDOWN) {}

  async isMyRoom(roomId: string): Promise<boolean> {
    const myRoomInfos = await this.redisClient.smembers(
      RedisKey.getRoomsByType(RoomType.MyRoom),
    );

    for (const myRoom of myRoomInfos) {
      if (myRoom === roomId) {
        return true;
      }
    }

    return false;
  }

  async isMyRoomOwner(clientId: string, roomId: string): Promise<boolean> {
    const roomDataString = await this.redisClient.hget(
      RedisKey.getStrRooms(),
      roomId,
    );

    this.logger.debug('roomDataString', roomDataString);

    const roomData = JSON.parse(roomDataString);
    this.logger.debug('roomData', roomData);

    if (roomData.ownerId === clientId) {
      return true;
    }

    return false;
  }

  async isRoomClient(clientId: string) {
    const memberId = clientId;
    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);
    const redisRoomId = await this.redisClient.get(memberKey);

    const playerIds = await this.redisClient.smembers(
      RedisKey.getStrRoomPlayerList(redisRoomId),
    );
  }
}
