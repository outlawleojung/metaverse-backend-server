import { RedisFunctionService } from '@libs/redis';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { RootServerService } from '../services/root-server.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import {
  CHATTING_SOCKET_S_MESSAGE,
  NATS_EVENTS,
  PLAYER_SOCKET_S_MESSAGE,
  RedisKey,
  SOCKET_SERVER_ERROR_CODE_GLOBAL,
} from '@libs/constants';
import {
  C_BASE_SET_ANIMATION,
  C_BASE_SET_EMOJI,
  C_BASE_SET_TRANSFORM,
} from './packets/packet';
import { NatsService } from '../nats/nats.service';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly tokenCheckService: TokenCheckService,
    private readonly rootServer: RootServerService,
    private readonly messageHandler: NatsMessageHandler,
    private readonly natsService: NatsService,
    private readonly redisFunctionService: RedisFunctionService,
  ) {}

  // 소켓 연결
  async handleConnection(
    server: Server,
    client: Socket,
    jwtAccessToken: string,
    sessionId: string,
  ) {
    const memberInfo =
      await this.tokenCheckService.checkLoginToken(jwtAccessToken);

    // 해당 멤버가 존재하지 않을 경우 연결 종료
    if (!memberInfo) {
      client.disconnect();
      return;
    }

    const memberId = memberInfo.memberInfo.memberId;

    client.join(memberId);
    client.join(sessionId);

    // 클라이언트 데이터 설정
    client.data.memberId = memberId;
    client.data.sessionId = sessionId;
    client.data.jwtAccessToken;
    client.data.clientId = client.id;

    this.logger.debug(
      `동기화 서버에 연결되었어요 ✅ : ${memberId} - sessionId : ${sessionId}`,
    );
  }

  async handleDisconnect(client: Socket) {
    this.logger.debug(`동기화 서버에 해제되었어요 ❌ : ${client.id} `);
  }

  async joinRoom(
    client: Socket,
    jwtAccessToken: string,
    roomId: string,
    sceneName: string,
    roomName: string,
    roomCode: string,
  ) {
    const redisRoomId = RedisKey.getStrRoomId(roomId);
    const memberSetKey = RedisKey.getStrRoomPlayerList(redisRoomId);

    try {
      // 현재 소켓이 해당 룸에 접속 중인지 체크
      if (client.rooms.has(roomId)) {
        return client.emit(
          CHATTING_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
          SOCKET_SERVER_ERROR_CODE_GLOBAL.ROOM_ALREADY_CONNECTED,
        );
      }

      // 토큰을 검증하여 멤버 정보를 확인
      const memberInfo =
        await this.tokenCheckService.checkLoginToken(jwtAccessToken);

      if (!memberInfo) {
        this.logger.debug(
          '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ disconnect ######################',
        );
        client.disconnect();
        return;
      }

      const memberId = memberInfo.memberInfo.memberId;

      // 룸아이디로 룸 정보 조회
      const checkRoom = await this.redisClient.get(redisRoomId);

      // 사용자키로 룸에 속해 있는지 조회
      const members = await this.redisClient.smembers(memberSetKey);

      // 사용자가 이미 룸에 접속한 상태라면
      if (members.includes(memberId)) {
        return client.emit(
          CHATTING_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
          SOCKET_SERVER_ERROR_CODE_GLOBAL.ROOM_ALREADY_CONNECTED,
        );
      }

      // 기존에 속해있는 룸 정보 조회 및 처리
      const currentRoomId = await this.redisClient.get(
        RedisKey.getStrMemberCurruntRoom(memberId),
      );
      if (currentRoomId) {
        const currentMemberSetKey =
          RedisKey.getStrRoomPlayerList(currentRoomId);

        // 기존 룸에서 사용자 제거
        await this.redisClient.srem(currentMemberSetKey, memberId);
      }

      // 룸에 사용자 정보 저장
      await this.redisClient.sadd(memberSetKey, memberId);

      // 사용자의 현재 룸 정보 업데이트
      await this.redisClient.set(
        RedisKey.getStrMemberCurruntRoom(memberId),
        redisRoomId,
      );

      let needSubscribe = false;
      // 룸이 없다면
      if (!checkRoom) {
        // 룸 아이디로 룸 정보 저장
        await this.redisClient.set(
          redisRoomId,
          JSON.stringify({ roomName, sceneName, roomCode }),
        );

        // 방 생성이 되면 해당 방을 구독 한다.
        needSubscribe = true;
      } else {
        // 방이 이미 있다면
        // 구독을 조회 하고 구독이 안되어 있으면 구독한다.
        needSubscribe = this.messageHandler.getSubscribe(
          `${NATS_EVENTS.PLAYER_ROOM}.${roomId}`,
        );
      }

      if (needSubscribe) {
        await this.messageHandler.registerHandler(
          `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
          async (data) => {
            await this.sendSyncPackets(data);
          },
        );
      }

      // JSON 데이터 업데이트를 위한 redisFunctionService 사용
      await this.redisFunctionService.updateJson(
        RedisKey.getStrMemberSocket(memberId),
        'roomId',
        redisRoomId,
      );
      await this.redisFunctionService.updateJson(
        RedisKey.getStrMemberSocket(memberId),
        'sceneName',
        sceneName,
      );

      client.data.roomName = roomName;
      client.data.roomCode = roomCode;
      client.data.sceneName = sceneName;
      client.data.roomId = redisRoomId;
      client.join(redisRoomId);

      // 룸 입장 이벤트 발생
      this.logger.debug('동기화 서버 룸 입장 이벤트 발생 ✅ : ', roomId);
      await this.natsService.publish(
        `${NATS_EVENTS.JOIN_ROOM}`,
        JSON.stringify({
          memberId: client.data.memberId,
          roomId: roomId,
        }),
      );
    } catch (error) {
      this.logger.error(
        `Error entering player room ${roomId}: ${error.message}`,
        error.stack,
      );
    }
  }

  // 룸 퇴장
  async leaveRoom(client: Socket, roomId: string) {
    this.logger.debug('룸 퇴장 이벤트 발생 : ' + roomId);
    const playerIds = await this.redisClient.smembers(
      RedisKey.getStrRoomPlayerList(roomId),
    );

    // 룸에 사용자가 본인 1명 뿐이라면 룸 삭제
    if (playerIds.length === 1) {
      await this.redisClient.del(roomId);

      await this.natsService.publish(NATS_EVENTS.DELETE_PLAYER_ROOM, roomId);
    }

    // 룸 사용자 리스트에서 사용자 정보 삭제
    await this.redisClient.srem(
      RedisKey.getStrRoomPlayerList(roomId),
      client.data.memberId,
    );

    await this.redisFunctionService.updateJson(
      RedisKey.getStrMemberSocket(client.data.memberId),
      'roomId',
      '',
    );

    // 기존 룸에서 사용자 제거
    const memberKey = RedisKey.getStrMemberCurruntRoom(client.data.memberId);
    await this.redisClient.del(memberKey);

    // 룸 퇴장 이벤트 발생
    await this.natsService.publish(
      `${NATS_EVENTS.LEAVE_ROOM}:${client.data.memberId}`,
      JSON.stringify({
        memberId: client.data.memberId,
        roomId: client.data.roomId,
      }),
    );
  }

  // 세션 아이디로 소켓 조회
  async getPlayerSocket(sessionId: string): Promise<Socket> {
    try {
      const room = this.rootServer
        .getServer()
        .sockets.adapter.rooms.get(sessionId);

      let socket = null;

      // 룸에 소켓이 한 개만 존재하므로, 해당 소켓을 직접 조회합니다.
      room.forEach((socketId) => {
        socket = this.rootServer.getServer().sockets.sockets.get(socketId);
      });

      return socket;
    } catch (error) {
      return null;
    }
  }

  // 사용자 이동 동기화
  async baseSetTransform(client: Socket, packet: C_BASE_SET_TRANSFORM) {
    const redisRoomId = RedisKey.getStrRoomId(client.data.roomId);

    const data = {
      name: PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_TRANSFORM,
      roomId: client.data.roomId,
      packet,
    };

    this.natsService.publish(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  // 사용자 애니메이션 동기화
  async baseSetAnimation(client: Socket, packet: C_BASE_SET_ANIMATION) {
    const redisRoomId = RedisKey.getStrRoomId(client.data.roomId);

    const data = {
      name: PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_ANIMATION,
      roomId: client.data.roomId,
      packet,
    };

    this.natsService.publish(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  // 사용자 이모지 동기화
  async baseSetEmoji(client: Socket, packet: C_BASE_SET_EMOJI) {
    const redisRoomId = RedisKey.getStrRoomId(client.data.roomId);

    const data = {
      name: PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_EMOJI,
      roomId: client.data.roomId,
      packet,
    };

    this.natsService.publish(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  // 동기화 룸 패킷 전송
  async sendSyncPackets(message: string) {
    const data = JSON.parse(message);
    const roomId = data.roomId;
    const packatName = data.name;
    const packet = data.packet;

    this.rootServer.getServer().to(roomId).emit(packatName, packet);
  }
}