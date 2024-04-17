import { SocialLoginResponseDto } from './dto/response/social.login.response.dto';
import { AutoLoginResponseDto } from './dto/response/auto.login.response.dto';
import { AutoLoginDto } from './dto/request/auto.login.dto';
import { AuthEmailDto } from './dto/request/auth.email.dto';
import { LoginAuthResponseDto } from './dto/response/login.auth.response.dto';
import { SignUpResponseDto } from './dto/response/signup.response.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  HttpStatus,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ErrorDto } from '../dto/error.response.dto';
import { ConfirmEmailResponseDto } from './dto/response/confirm.email.response.dto';
import { ConfirmEmailDto } from './dto/request/confirm.email.dto';
import { ResetPasswordDto } from './dto/request/reset.password.dto';
import { SuccessDto } from '../dto/success.response.dto';
import { AuthEmailResponseDto } from './dto/response/auth.email.response.dto';
import { ArzmetaLogInMemberDto } from './dto/request/arzmeta.login.member.dto';
import {
  AuthService,
  BasicTokenGuard,
  QueryRunner,
  RefreshTokenGuard,
} from '@libs/common';
import { AuthEmailErrorResponseDto } from './dto/response/auth.email.error.response.dto';
import { RegisterDto } from './dto/request/register.dto';
import { LoginResponseDto } from './dto/response/login.response';
import { TransactionInterceptor } from '@libs/entity';
import { QueryRunner as QR } from 'typeorm';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('ACCOUNT - 계정')
@Controller('api/account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 액세스 토큰 재발급
   * @param rawToken
   * @returns accessToken
   */
  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  async createTokenAccess(@Headers('authorization') rawToken: string) {
    console.log('token : ', rawToken);
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const accessToken = await this.authService.rotateToken(token, false);

    return { accessToken };
  }

  /**
   * 리프레쉬 토큰 재발급
   * @param rawToken
   * @returns refreshToken
   */
  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  async createTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const refreshToken = await this.authService.rotateToken(token, true);

    await this.authService.saveRefreshToken(refreshToken);

    return { refreshToken };
  }

  /**
   * 이메일로 로그인 하기
   * @param rawToken
   * @returns { accessToken, refreshToken}
   */
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
  })
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  async loginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);

    return await this.authService.loginWithEmail(credentials);
  }

  /**
   * 이메일로 회원 가입 하기
   * @param email
   * @param password
   * @param regPathType
   * @returns { accessToken, refreshToken}
   */
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
  })
  @Post('register/email')
  async registerEmail(@Body() data: RegisterDto) {
    return await this.authService.registerWithEmail({
      accountToken: data.email,
      password: data.password,
      regPathType: data.regPathType,
    });
  }

  /**
   * 자동 로그인
   * @param rawToken
   * @returns
   */
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
  })
  @ApiOperation({ summary: '자동 로그인' })
  @UseGuards(RefreshTokenGuard)
  @Post('login/autoLogin')
  async autoLogin(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    return await this.authService.autoLogin(token);
  }

  // 이메일 인증 번호 받기
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthEmailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: AuthEmailErrorResponseDto,
  })
  @ApiOperation({ summary: '이메일 인증번호 받기' })
  @UseInterceptors(TransactionInterceptor)
  @Post('authEmail')
  async authEmail(
    @QueryRunner() queryRunner: QR,
    @Body() autoEmailDto: AuthEmailDto,
  ) {
    return await this.accountService.authEmail(autoEmailDto, queryRunner);
  }

  // 이메일 인증 확인 받기
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConfirmEmailResponseDto,
  })
  @ApiOperation({ summary: '이메일 인증 확인' })
  @UseInterceptors(TransactionInterceptor)
  @Post('confirmEmail')
  async confirmEmail(
    @QueryRunner() queryRunner: QR,
    @Body() confirmEmailDto: ConfirmEmailDto,
  ) {
    return await this.accountService.confirmEmail(confirmEmailDto, queryRunner);
  }

  // 패스워드 재설정
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiOperation({ summary: '패스워드 재설정' })
  @UseInterceptors(TransactionInterceptor)
  @Post('resetPassword')
  async resetPassword(
    @QueryRunner() queryRunner: QR,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.accountService.resetPassword(
      resetPasswordDto,
      queryRunner,
    );
  }
}
