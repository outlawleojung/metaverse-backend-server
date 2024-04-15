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
  Delete,
  Headers,
  Param,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { SignMemberDto } from './dto/request/sign.member.dto';
import { LogInMemberDto } from './dto/request/login.member.dto';
import { LoginAuthDto } from './dto/request/login.auth.dto';
import { ErrorDto } from '../dto/error.response.dto';
import { ConfirmEmailResponseDto } from './dto/response/confirm.email.response.dto';
import { ConfirmEmailDto } from './dto/request/confirm.email.dto';
import { ResetPasswordDto } from './dto/request/reset.password.dto';
import { SuccessDto } from '../dto/success.response.dto';
import { AuthEmailResponseDto } from './dto/response/auth.email.response.dto';
import { ArzmetaLogInMemberDto } from './dto/request/arzmeta.login.member.dto';
import { AzmetaLoginResponseDto } from './dto/response/arzmeta.login.response.dto';
import { LinkedAccountDto } from './dto/request/linked.account.dto';
import { LinkedAccountResponseDto } from './dto/response/linked.account.response.dto';
import {
  AuthService,
  BasicTokenGuard,
  JwtGuard,
  MemberDeco,
  RefreshTokenGuard,
} from '@libs/common';
import { AlreadyLinkedAccountResponseDto } from './dto/response/already.linked.account.response.dto';
import { AuthEmailErrorResponseDto } from './dto/response/auth.email.error.response.dto';
import { RegisterDto } from './dto/request/register.dto';
import { LoginResponseDto } from './dto/response/login.response';

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

  //////////////////////

  // // 계정 생성
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   type: ErrorDto,
  //   description: 'Error',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: SignUpResponseDto,
  // })
  // @ApiOperation({ summary: '자체 계정 생성' })
  // @Post('create')
  // async createMember(@Body() memberData: SignMemberDto) {
  //   return await this.accountService.createMember(memberData);
  // }

  // //로그인
  // @ApiOperation({ summary: '자체 로그인' })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   type: ErrorDto,
  //   description: 'Error',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: AzmetaLoginResponseDto,
  // })
  // @Post('arzmetaLogin')
  // async login(@Body() memberData: ArzmetaLogInMemberDto) {
  //   return await this.accountService.arzmetaLogin(memberData);
  // }

  // // 소셜 로그인
  // @ApiOperation({ summary: '소셜 로그인 및 계정 생성' })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   type: ErrorDto,
  //   description: 'Error',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: SocialLoginResponseDto,
  // })
  // @Post('socialLogin')
  // async socialLogin(@Body() memberData: LogInMemberDto) {
  //   return await this.accountService.socialLogin(memberData);
  // }

  // // 로그인 연동
  // @ApiOperation({ summary: '계정 연동 하기' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: LinkedAccountResponseDto,
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   type: AlreadyLinkedAccountResponseDto,
  // })
  // @UseGuards(JwtGuard)
  // @Post('linkedAccount')
  // async linkedAccount(
  //   @MemberDeco('memberId') memberId: string,
  //   @Body() data: LinkedAccountDto,
  // ) {
  //   return await this.accountService.linkedAccount(memberId, data);
  // }

  // // 로그인 해제
  // @ApiOperation({ summary: '계정 연동 해제' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: LinkedAccountResponseDto,
  // })
  // @UseGuards(JwtGuard)
  // @Delete('releaseLinkedAccount/:providerType')
  // async releaseLinkedAccount(
  //   @Headers() headers,
  //   @Param('providerType') providerType: number,
  // ) {
  //   return await this.accountService.releaseLinkedAccount(
  //     headers.memberId,
  //     providerType,
  //   );
  // }

  // // 로그인 유효성 검증
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   type: ErrorDto,
  //   description: 'Error',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: LoginAuthResponseDto,
  // })
  // @ApiOperation({ summary: '로그인 유효성 검증' })
  // @Post('loginAuth')
  // async loginAuth(@Body() loginAuthDto: LoginAuthDto) {
  //   return await this.accountService.loginAuth(loginAuthDto);
  // }

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
  @Post('authEmail')
  async authEmail(@Body() autoEmailDto: AuthEmailDto) {
    return await this.accountService.authEmail(autoEmailDto);
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
  @Post('confirmEmail')
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    return await this.accountService.confirmEmail(confirmEmailDto);
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
  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.accountService.resetPassword(resetPasswordDto);
  }

  // 아즈메타 계정 여부 확인
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiOperation({ summary: '아즈메타 계정 여부 확인' })
  @Post('checkArzmetaAccount')
  async checkArzmetaAccount(@Body() data: ArzmetaLogInMemberDto) {
    return await this.accountService.checkArzmetaAccount(data);
  }

  @ApiExcludeEndpoint()
  @Get()
  async getDatabase() {
    return await this.accountService.getDatabase();
  }

  @ApiExcludeEndpoint()
  @Get('createTestAccount')
  async createTestAccount() {
    return await this.accountService.createTestAccount();
  }

  // 개발용 Encrypt API
  @ApiExcludeEndpoint()
  @Post('createTestAccountEncrypt')
  async createTestAccountToken1(@Body() data: any) {
    return await this.accountService.createTestAccountEncrypt(data);
  }

  @ApiExcludeEndpoint()
  @Get('test-date')
  async testDate() {
    return await this.accountService.testDate();
  }
}
