import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Member, SessionInfo } from '@libs/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOCKET_S_GLOBAL } from '@libs/constants';

interface JwtPayload {
  idx: string;
  nickname: string;
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
      return { memberId: payload.idx, nickname: payload.nickname };
    }

    return null;
  }

  async checkTokenSession(
    client: Socket,
    clientJwt: string,
    sessionId: string,
  ) {
    //토큰 검증
    await jwt.verify(clientJwt, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        this.logger.debug(
          '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ disconnect ######################',
        );
        client.disconnect();
        console.log('err : ' + err);
        return;
      }
      const payload = decoded as JwtPayload;
      client['data'].memberId = payload.idx;
    });

    const sessionInfo = await this.sessionInfoRepository.findOne({
      where: {
        memberId: client.data.memberId,
      },
    });

    // 세션 아이디 검증
    if (sessionId !== sessionInfo.sessionId) {
      this.logger.debug(
        '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ disconnect ######################',
      );
      console.log('세션 아이디가 일치하지 않습니다.');
      client.emit(SOCKET_S_GLOBAL.S_DROP_PLAYER, 10001);
      client.disconnect();
      return;
    }
  }
}
