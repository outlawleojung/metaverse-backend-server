import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { Member } from '@libs/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}
  private readonly logger = new Logger(TokenCheckService.name);

  async checkLoginToken(accessToken: string) {
    let payload = null;
    await jwt.verify(accessToken, process.env.SECRET_KEY, (err, decoded) => {
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

  async checkAccessToken(client: CustomSocket, clientJwt: string) {
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
  }

  async getJwtAccessToken(client: CustomSocket) {
    let jwtAccessToken;

    if (!client.handshake.auth.jwtAccessToken) {
      jwtAccessToken = Decrypt(client.handshake.headers.authorization);
    } else {
      jwtAccessToken = Decrypt(client.handshake.auth.jwtAccessToken);
    }

    return { jwtAccessToken };
  }
}
