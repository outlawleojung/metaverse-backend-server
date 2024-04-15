import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import {
  C_BASE_SET_OBJECT_DATA,
  C_MYROOM_END_EDIT,
  C_MYROOM_KICK,
  C_MYROOM_SHUTDOWN,
  C_MYROOM_START_EDIT,
  S_MYROOM_END_EDIT,
  S_MYROOM_GET_ROOMINFO,
  S_MYROOM_KICK,
  S_MYROOM_SHUTDOWN,
  S_MYROOM_START_EDIT,
} from '../packets/myroom-packet';
import {
  MY_ROOM_SOCKET_C_MESSAGE,
  NATS_EVENTS,
  RedisKey,
  SOCKET_S_GLOBAL,
} from '@libs/constants';
import { RoomType } from '../room/room-type';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { RequestPayload } from '../packets/packet-interface';
import { ClientService } from '../services/client.service';
import { CustomSocket } from '../interfaces/custom-socket';

@Injectable()
export class MyRoomService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly clientService: ClientService,
    private readonly messageHandler: NatsMessageHandler,
  ) {}

  private readonly logger = new Logger(MyRoomService.name);

  private server: Server;
  async setServer(server: Server) {
    this.server = server;
  }

  async handleRequestMessage(client: CustomSocket, payload: RequestPayload) {
    switch (payload.eventName) {
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
        await this.shutDown(client);
        break;
      default:
        this.logger.debug('잘못된 패킷 입니다.');
        client.emit(SOCKET_S_GLOBAL.ERROR, '잘못된 패킷 입니다.');
        break;
    }
  }

  async roomSubscribeCallbackmessage(message) {
    this.logger.debug('마이룸 구독 콜백 ✅');
    const data = JSON.parse(message);

    switch (data.packet.eventName) {
    }
  }

  async getRoomInfo(client: CustomSocket) {
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

    const { eventName, ...packetData } = packet;
    return client.emit(eventName, JSON.stringify(packetData));
  }

  async startEdit(client: CustomSocket) {
    const memberId = client.data.memberId;
    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);
    const redisRoomId = await this.redisClient.get(memberKey);
    const clientId = client.data.clientId;

    const isOwner = await this.isMyRoomOwner(clientId, redisRoomId);

    if (!isOwner) {
      return client.emit(SOCKET_S_GLOBAL.ERROR, '마이룸 오너가 아닙니다.');
    }

    const packet = new C_MYROOM_START_EDIT();

    const response = {
      redisRoomId: redisRoomId,
      packet: packet,
    };

    this.logger.debug('마이룸 편집 이벤트 발행', redisRoomId);
    this.messageHandler.publishHandler(
      `${NATS_EVENTS.MY_ROOM}:${redisRoomId}`,
      JSON.stringify(response),
    );
  }

  async endEdit(client: CustomSocket, packet: C_MYROOM_END_EDIT) {
    const memberId = client.data.memberId;
    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);
    const redisRoomId = await this.redisClient.get(memberKey);
    const clientId = client.data.clientId;

    const isOwner = await this.isMyRoomOwner(clientId, redisRoomId);

    if (!isOwner) {
      return client.emit(SOCKET_S_GLOBAL.ERROR, '마이룸 오너가 아닙니다.');
    }

    const response = new C_MYROOM_END_EDIT();
    response.isChanged = packet.isChanged;

    const data = {
      redisRoomId,
      packet: response,
    };

    this.logger.debug('마이룸 편집 종료 이벤트 발행');
    this.messageHandler.publishHandler(
      `${NATS_EVENTS.MY_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  async broadcastStartEdit(data) {
    const redisRoomId = data.redisRoomId;
    const packet = new S_MYROOM_START_EDIT();
    const { eventName } = packet;

    this.server.to(redisRoomId).emit(eventName, '');
  }

  async broadcastEndEdit(data) {
    const redisRoomId = data.redisRoomId;
    const packet = new S_MYROOM_END_EDIT();
    packet.isChanged = data.packet.isChanged;

    const { eventName, ...packetData } = packet;

    this.server.to(redisRoomId).emit(eventName, JSON.stringify(packetData));
  }

  async kick(client: CustomSocket, packet: C_MYROOM_KICK) {
    const memberId = client.data.memberId;
    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);
    const redisRoomId = await this.redisClient.get(memberKey);
    const clientId = client.data.clientId;

    const isOwner = await this.isMyRoomOwner(clientId, redisRoomId);

    if (!isOwner) {
      return client.emit(SOCKET_S_GLOBAL.ERROR, '마이룸 오너가 아닙니다.');
    }

    const response = new S_MYROOM_KICK();
    response.clientId = packet.clientId;

    const data = {
      redisRoomId,
      packet: response,
    };

    this.logger.debug('마이룸 강제 퇴장 이벤트 발행');
    this.messageHandler.publishHandler(
      `${NATS_EVENTS.MY_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  async broadcastKick(data) {
    const redisRoomId = data.redisRoomId;

    const { eventName, ...packetData } = data.packet;

    this.server.to(redisRoomId).emit(eventName, packetData);
  }

  async shutDown(client: CustomSocket) {
    const redisRoomId = client.data.roomId;
    const clientId = client.data.clientId;

    const isMyRoomOwner = this.isMyRoomOwner(clientId, redisRoomId);

    if (!isMyRoomOwner) {
      return client.emit(SOCKET_S_GLOBAL.ERROR, '마이룸 오너가 아닙니다.');
    }

    const packet = new S_MYROOM_SHUTDOWN();

    const data = {
      redisRoomId,
      packet,
    };

    this.messageHandler.publishHandler(
      `${NATS_EVENTS.MY_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  async broadcastMyRoomShutDown(data) {
    const redisRoomId = data.redisRoomId;

    const { eventName, ...packetData } = data.packet;

    this.server.to(redisRoomId).emit(eventName, packetData);
  }

  async updateNickname(nickname: string) {}

  async updateAvatarInfo(client: CustomSocket, packet: C_BASE_SET_OBJECT_DATA) {
    const redisRoomId = client.data.roomId;

    const data = new C_BASE_SET_OBJECT_DATA();
    data.objectId = packet.objectId;
    data.objectData = packet.objectData;
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
