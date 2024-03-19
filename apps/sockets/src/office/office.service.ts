import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { MemberOfficeReservationInfo } from '@libs/entity';
import { RedisFunctionService } from '@libs/redis';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import {
  OFFICE_SOCKET_S_MESSAGE,
  RedisKey,
  SOCKET_SERVER_ERROR_CODE_GLOBAL,
} from '@libs/constants';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { Repository } from 'typeorm';
import { promisify } from 'util';

@Injectable()
export class OfficeService {
  private readonly logger = new Logger(OfficeService.name);
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(MemberOfficeReservationInfo)
    private memberOfficeReservationInfoRepository: Repository<MemberOfficeReservationInfo>,
    private readonly tokenCheckService: TokenCheckService,
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
    client.join(client.handshake.auth.sessionId);

    // 클라이언트 데이터 설정
    client.data.memberId = memberId;
    client.data.sessionId = client.handshake.auth.sessionId;
    client.data.jwtAccessToken = client.handshake.auth.jwtAccessToken;
    client.data.clientId = client.id;

    this.logger.debug(
      `오피스 서버에 연결되었어요 ✅ : ${memberId} - sessionId : ${sessionId}`,
    );
  }

  // 회의실 입장 예약하기
  async officeQueueRegister(
    client: Socket,
    jwtAccessToken: string,
    roomCode: string,
  ) {
    const memberInfo =
      await this.tokenCheckService.checkLoginToken(jwtAccessToken);

    const smembersAsync = promisify(this.redisClient.smembers).bind(
      this.redisClient,
    );

    const saddAsync = promisify(this.redisClient.sadd).bind(this.redisClient);

    // 예약 목록 조회
    const memberOfficeReservationData =
      await this.memberOfficeReservationInfoRepository.findOne({
        where: {
          roomCode: roomCode,
        },
      });

    if (!memberOfficeReservationData) {
      this.logger.debug('회의실이 존재하지 않습니다.');
      return client.emit(
        OFFICE_SOCKET_S_MESSAGE.S_OFFICE_QUEUE_REGISTER,
        JSON.stringify({
          code: SOCKET_SERVER_ERROR_CODE_GLOBAL.OFFICE_NOT_EXIST,
        }),
      );
    }

    const officeReservationLength = await smembersAsync(
      RedisKey.getStrOfficeReservRoomCode(roomCode),
    );

    // 예약 목록에 해당 회원이 존재하는지 조회
    if (
      (
        await smembersAsync(RedisKey.getStrOfficeReservRoomCode(roomCode))
      ).includes(memberInfo.memberInfo.memberId)
    ) {
      this.logger.debug('이미 예약 대기중인 회의실 입니다.');
      return client.emit(
        OFFICE_SOCKET_S_MESSAGE.S_OFFICE_QUEUE_REGISTER,
        JSON.stringify({
          code: SOCKET_SERVER_ERROR_CODE_GLOBAL.OFFICE_USER_ALREADY_RESERVED,
        }),
      );
    } else {
      if (
        memberOfficeReservationData.personnel <= officeReservationLength.length
      ) {
        this.logger.debug('예약 인원이 초과되었습니다.');
        return client.emit(
          OFFICE_SOCKET_S_MESSAGE.S_OFFICE_QUEUE_REGISTER,
          JSON.stringify({
            code: SOCKET_SERVER_ERROR_CODE_GLOBAL.OFFICE_OVER_CAPACITY,
          }),
        );
      }

      // 회원 존재 유무
      if (
        this.redisClient.exists(
          RedisKey.getStrMemberSocket(client.data.memberId),
        )
      ) {
        // 소켓 정보 업데이트
        await this.redisFunctionService.updateJson(
          RedisKey.getStrMemberSocket(client.data.memberId),
          RedisKey.getStrOfficeReservKey(),
          roomCode,
        );

        // 예약 목록에 회원 추가
        await saddAsync(
          RedisKey.getStrOfficeReservRoomCode(roomCode),
          memberInfo.memberInfo.memberId,
        );

        // 회의실 대기방 접속 (채팅방이나 나머지는 roomId를 기준으로 접속되어서 roomCode로 별도 입장)
        client.join(roomCode);
        client.data.officeRoomCode = roomCode;

        // 인원수 다시 조회
        const officeReservationWaitingPlayer = await smembersAsync(
          RedisKey.getStrOfficeReservRoomCode(roomCode),
        );

        //회의실 예약 대기 성공 시
        return client.emit(
          OFFICE_SOCKET_S_MESSAGE.S_OFFICE_QUEUE_REGISTER,
          JSON.stringify({
            code: SOCKET_SERVER_ERROR_CODE_GLOBAL.OFFICE_RESERVATION_SUCCESSFUL,
            waitingPlayer: officeReservationWaitingPlayer.length,
          }),
        );
      } else {
        return client.emit(
          OFFICE_SOCKET_S_MESSAGE.S_OFFICE_QUEUE_REGISTER,
          JSON.stringify({
            code: SOCKET_SERVER_ERROR_CODE_GLOBAL.OFFICE_NOT_EXIST,
          }),
        );
      }
    }
  }

  async officeQueueExit(client: Socket) {
    const roomCode = client.data.officeRoomCode;
    const memberId = client.data.memberId;

    if (roomCode) {
      client.leave(roomCode);

      // 예약 목록에서 회원 삭제
      await this.redisClient.srem(
        RedisKey.getStrOfficeReservRoomCode(roomCode),
        memberId,
      );

      if (
        await this.redisClient.exists(RedisKey.getStrMemberSocket(memberId))
      ) {
        // 소켓 정보 업데이트
        await this.redisFunctionService.updateJson(
          RedisKey.getStrMemberSocket(memberId),
          RedisKey.getStrOfficeReservKey(),
          '',
        );
      }

      return client.emit(
        OFFICE_SOCKET_S_MESSAGE.S_OFFICE_QUEUE_EXIT,
        JSON.stringify({
          code: SOCKET_SERVER_ERROR_CODE_GLOBAL.OFFICE_RESERVATION_LEAVE,
        }),
      );
    }
  }
}