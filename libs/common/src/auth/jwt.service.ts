import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Jwt, JwtPayload } from 'jsonwebtoken';
import { options, secretKey } from '../config/jwtSecret';
import { Member } from '@libs/entity';
import { Decrypt } from '../utils/crypter';
import { SessionService } from './session.service';
import { ERRORCODE, ERROR_MESSAGE } from '@libs/constants';

type TokenMember = {
  idx: string;
  iat: number;
  exp: number;
};

@Injectable()
export class JwtService {
  constructor(private readonly sessionService: SessionService) {}
  signToken(member: Member): string {
    const payload = {
      idx: member.memberId,
      nickname: member.nickname,
      memberCode: member.memberCode,
    };

    return jwt.sign(payload, secretKey, options);
  }
  verifyToken(token: string) {
    return jwt.verify(token, secretKey);
  }

  async parseToken(token: string, sessionId: string) {
    try {
      const jwtToken: Member | Jwt | JwtPayload | string | number =
        await this.verifyToken(String(Decrypt(token)));
      const member = jwtToken as TokenMember;
      const sessionInfo = await this.sessionService.checkSession(
        member.idx,
        sessionId,
      );

      if (sessionInfo === ERRORCODE.NET_E_DUPLICATE_LOGIN) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_DUPLICATE_LOGIN,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_DUPLICATE_LOGIN),
          },
          HttpStatus.FORBIDDEN,
        );
      } else if (sessionInfo === ERRORCODE.NET_E_EMPTY_TOKEN) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_EMPTY_TOKEN,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_EMPTY_TOKEN),
          },
          HttpStatus.FORBIDDEN,
        );
      }

      return member.idx;
    } catch (err) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_INVALID_TOKEN,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_INVALID_TOKEN),
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
