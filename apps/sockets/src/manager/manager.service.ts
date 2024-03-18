import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Member } from '@libs/entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { RedisFunctionService } from '@libs/redis';
import axios from 'axios';
import { NatsService } from '../nats/nats.service';
import {
  NAMESPACE,
  NATS_EVENTS,
  RedisKey,
  SOCKET_S_GLOBAL,
} from '@libs/constants';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private readonly redisFunctionService: RedisFunctionService,
    private readonly tokenCheckService: TokenCheckService,
    private natsService: NatsService,
  ) {}
  private readonly logger = new Logger(ManagerService.name);

  //소켓 연결
  async handleConnection(
    server: Server,
    client: Socket,
    jwtAccessToken: string,
    sessionId: string,
  ) {
    await this.tokenCheckService.checkTokenSession(
      client,
      jwtAccessToken,
      sessionId,
    );

    if (!client.data.memberId) {
      client.emit(SOCKET_S_GLOBAL.S_DROP_PLAYER, 10002);
      client.disconnect();
      return;
    }

    const memberInfo =
      await this.tokenCheckService.checkLoginToken(jwtAccessToken);

    const memberId = memberInfo.memberInfo.memberId;

    // 소켓 정보 조회
    const socketInfo = await this.redisClient.get(
      RedisKey.getStrMemberSocket(memberId),
    );

    // 중복 로그인 된 클라이언트가 있는 경우
    if (socketInfo) {
      const socketData = JSON.parse(socketInfo);

      // 클라이언트에게 중복 로그인 알림
      server.sockets
        .to(socketData.sessionId)
        .emit(SOCKET_S_GLOBAL.S_DROP_PLAYER, 10000);

      this.natsService.publish(
        `${NATS_EVENTS.DUPLICATE_LOGIN_USER}:${sessionId}`,
        socketData.sessionId,
      );

      // 서버에 저장된 소켓 정보 삭제
      await this.redisClient.del(RedisKey.getStrMemberSocket(memberId));
    }

    //사용자 닉네임 조회
    const member = await this.memberRepository.findOne({
      where: {
        memberId: memberId,
      },
    });

    // 클라이언트 데이터 설정
    client.data.memberId = memberId;
    client.data.sessionId = sessionId;
    client.data.jwtAccessToken = client.handshake.auth.jwtAccessToken;
    client.data.nickname = member.nickname;
    client.data.namespace = NAMESPACE.MANAGER;

    client.join(memberId);
    client.join(sessionId);

    this.logger.debug(
      `매니저 서버에 연결되었어요 ✅: ${memberId} - sessionId : ${sessionId}`,
    );

    await this.redisClient.set(
      RedisKey.getStrMemberSocket(memberId),
      JSON.stringify(client.data),
    );

    //소켓 연결시 클라이언트에게 사용자 정보 전송
    client.emit(
      SOCKET_S_GLOBAL.S_PLAYER_CONNECTED,
      JSON.stringify(client.data),
    );
  }

  // 닉네임 변경 요청
  async nicknameChange(client: Socket) {
    const nicknameFind = await this.memberRepository.findOne({
      where: {
        memberId: client.data.memberId,
      },
    });

    return await this.redisFunctionService.updateJson(
      RedisKey.getStrMemberSocket(client.data.memberId),
      'nickname',
      nicknameFind.nickname,
    );
  }

  // 접속 인원 알림
  async getCurrentUsers(data: any) {
    const serverType = process.env.SERVER_TYPE;
    const currentUsers = await this.redisClient.keys('socket:*');

    return await axios.post(process.env.DOORAY_WEBHOOK_URL, {
      botName: '아즈메타',
      botIconImage:
        'https://arzmeta.net/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Farz_logo_dark.f5efb990.png&w=1080&q=75',
      attachments: [
        {
          title: '접속 인원 알림',
          text: `현재 ${serverType} 아즈메타 접속자 수는 ${currentUsers.length} 명 입니다.`,
        },
      ],
    });
  }
}
