import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'token', passwordField: 'password' });
  }

  async validate(token: string, password: string, done: CallableFunction) {
    console.log('validate token: ', token);
    const user = await this.authService.validateUser(token, password);
    console.log('validate user: ', user);

    if (!user) {
      throw new UnauthorizedException('이메일 또는 패스워드를 확인해 주세요.');
    }
    return done(null, user);
  }
}
