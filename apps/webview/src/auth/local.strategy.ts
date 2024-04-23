import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@libs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'token', passwordField: 'password' });
  }

  async validate(token: string, _: string, done: CallableFunction) {
    console.log('validate token: ', token);
    const member = await this.authService.validateUser(token);
    console.log('validate user: ', member);

    if (!member) {
      throw new UnauthorizedException('이메일 또는 패스워드를 확인해 주세요.');
    }
    return done(null, member);
  }
}
