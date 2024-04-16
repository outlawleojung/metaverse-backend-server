import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Member, SessionInfo } from '@libs/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOCKET_S_GLOBAL } from '@libs/constants';
import { Decrypt } from '@libs/common';
import { CustomSocket } from '../../interfaces/custom-socket';

interface JwtPayload {
  idx: string;
  nickname: string;
  memberCode: string;
}

@Injectable()
export class TokenCheckService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(SessionInfo)
    private sessionInfoRepository: Repository<SessionInfo>,
  ) {}
  private readonly logger = new Logger(TokenCheckService.name);

  async checkLoginToken(clientJwt: string) {
    let payload = null;
    await jwt.verify(clientJwt, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        this.logger.debug('err : ' + JSON.stringify(err));
        return;
      }
      payload = decoded as JwtPayload;
    });

    this.logger.debug(`payload : ${payload.idx}, ${payload.nickname}`);
    if (payload) {
      return {
        memberId: payload.idx,
        memberCode: payload.memberCode,
        nickname: payload.nickname,
      };
    }

    return null;
  }

  async checkTokenSession(
    client: CustomSocket,
    clientJwt: string,
    sessionId: string,
  ) {
    //토큰 검증
    await jwt.verify(clientJwt, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        this.logger.debug('err: ', JSON.stringify(err));
        client.disconnect();
        console.log('err : ' + err);
        return;
      }
      const payload = decoded as JwtPayload;
      client['data'].memberId = payload.idx;
    });

    // const sessionInfo = await this.sessionInfoRepository.findOne({
    //   where: {
    //     memberId: client.data.memberId,
    //   },
    // });

    // 세션 아이디 검증
    // if (sessionId !== sessionInfo.sessionId) {
    //   this.logger.debug('세션 아이디가 일치하지 않습니다.');
    //   client.emit(SOCKET_S_GLOBAL.S_DROP_PLAYER, 10001);
    //   client.disconnect();
    //   return;
    // }
  }

  async getJwtAccessTokenAndSessionId(client: CustomSocket) {
    let jwtAccessToken;
    let sessionId;

    if (!client.handshake.auth.jwtAccessToken) {
      jwtAccessToken = Decrypt(client.handshake.headers.authorization);
    } else {
      jwtAccessToken = Decrypt(client.handshake.auth.jwtAccessToken);
    }

    if (!client.handshake.auth.sessionId) {
      sessionId = String(Decrypt(client.handshake.headers.cookie));
    } else {
      sessionId = String(Decrypt(client.handshake.auth.sessionId));
    }

    return { jwtAccessToken, sessionId };
  }
}
