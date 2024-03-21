import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  async loginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);

    return await this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  async registerEmail(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('regPathType') regPathType: number,
  ) {
    return await this.authService.registerWithEmail({
      accountToken: email,
      password,
      regPathType,
    });
  }
}
