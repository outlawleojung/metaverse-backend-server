import {
  TokenExpiredError,
  NotBeforeError,
  JsonWebTokenError,
  JwtPayload,
  Jwt,
} from 'jsonwebtoken';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { options, secretKey } from '../config/loginTokenSecret';
import { Decrypt } from '@libs/common';
import { ERRORCODE } from '@libs/constants';

export type LoginTokenType = {
  idx: string;
  pw: string;
  pwdt: Date;
};

@Injectable()
export class LoginTokenService {
  private readonly logger = new Logger(LoginTokenService.name);
  signToken(memberId: string, password: string, passwdUpdatedAt: Date): string {
    const payload: LoginTokenType = {
      idx: memberId,
      pw: password,
      pwdt: passwdUpdatedAt,
    };

    return jwt.sign(payload, secretKey, options);
  }
  verifyToken(token: string) {
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        this.logger.error('TokenExpiredError : expired token');
        throw new HttpException(
          {
            message: err.message,
            error: ERRORCODE.NET_E_EXPIRED_TOKEN,
          },
          HttpStatus.FORBIDDEN,
        );
      } else if (err instanceof NotBeforeError) {
        this.logger.error('NotBeforeError: invalid token');
        throw new HttpException(
          {
            message: err.message,
            error: ERRORCODE.NET_E_INVALID_TOKEN,
          },
          HttpStatus.FORBIDDEN,
        );
      } else if (err instanceof JsonWebTokenError) {
        this.logger.error('JsonWebTokenError: invalid token');
        throw new HttpException(
          {
            message: err.message,
            error: ERRORCODE.NET_E_INVALID_TOKEN,
          },
          HttpStatus.FORBIDDEN,
        );
      } else {
        this.logger.error('invalid token : ' + { err });
        throw new HttpException(
          {
            message: err.message,
            error: ERRORCODE.NET_E_INVALID_TOKEN,
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    return decoded;
  }

  async checkLoginToken(loginToken: string) {
    try {
      const token: LoginTokenType | Jwt | JwtPayload | string | number =
        await this.verifyToken(String(Decrypt(loginToken)));

      return token;
    } catch (err) {
      this.logger.error({ err });
      if (err instanceof TokenExpiredError) {
        this.logger.error('TokenExpiredError : expired token');
        throw new HttpException(
          {
            message: err.message,
            error: ERRORCODE.NET_E_EXPIRED_TOKEN,
          },
          HttpStatus.FORBIDDEN,
        );
      } else if (err instanceof NotBeforeError) {
        this.logger.error('NotBeforeError: invalid token');
        throw new HttpException(
          {
            errorMessage: err.message,
            error: ERRORCODE.NET_E_INVALID_TOKEN,
          },
          HttpStatus.FORBIDDEN,
        );
      } else if (err instanceof JsonWebTokenError) {
        this.logger.error('JsonWebTokenError: invalid token');
        throw new HttpException(
          {
            message: err.message,
            error: ERRORCODE.NET_E_INVALID_TOKEN,
          },
          HttpStatus.FORBIDDEN,
        );
      } else {
        this.logger.error('invalid token : ' + { err });
        throw new HttpException(
          {
            message: err.message,
            error: ERRORCODE.NET_E_INVALID_TOKEN,
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }
}
