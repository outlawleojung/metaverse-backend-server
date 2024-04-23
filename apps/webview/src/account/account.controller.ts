import { LocalAuthGuard } from '../auth/local.auth.guard';
import {
  Param,
  Res,
  Response,
  UseInterceptors,
} from '@nestjs/common/decorators';
import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { MemberDecorator } from '../common/decorators/member.decorator';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { LoginRequestDto } from './dto/req/login.request.dto';
import { Member } from '@libs/entity';
import { LoggedInGuard } from '../auth/logged.in.guard';
import { ResetPasswordtDto } from './dto/req/reset.password.dto';
import { KtmfEmailDto } from './dto/req/ktmf.email.dto';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('ACCOUNT - 계정')
@Controller('api/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // 로그인 여부 체크
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Member,
  })
  @Get()
  getUsers(@MemberDecorator() member) {
    return member || false;
  }

  // 로그인 (이메일, 패스워드)
  @ApiOperation({ summary: '아즈메타 로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @MemberDecorator() member: Member,
    @Body() data: LoginRequestDto,
  ) {
    console.log('login data: ', data);
    console.log(member);
    return member;
  }

  // 로그아웃
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(LoggedInGuard)
  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('connect.sid', {
      domain: process.env.DOMAIN,
      httpOnly: true,
    });
    return res.send('ok');
  }

  // 탈퇴하기
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '탈퇴' })
  @UseGuards(LoggedInGuard)
  @Post('withdrawal')
  async withdrawal(@MemberDecorator() member, @Res() res) {
    const result = await this.accountService.withdrawal(member.memberId);

    if (result) {
      res.clearCookie('connect.sid', {
        domain: process.env.DOMAIN,
        httpOnly: true,
      });
      res.send('OK');
    } else {
      throw new ForbiddenException('회원 탈퇴 실패!!');
    }
  }

  // 패스워드 재설정
  @ApiOperation({ summary: '패스워드 재설정' })
  @Post('resetPassword')
  async resetPassword(@Body() token: ResetPasswordtDto) {
    return await this.accountService.resetPassword(token);
  }

  // 패스워드 재설정
  @ApiOperation({ summary: 'KTMF 이벤트 이메일 등록' })
  @UseGuards(LoggedInGuard)
  @Post('ktmf-email')
  async ktmfEmail(@MemberDecorator() member, @Body() data: KtmfEmailDto) {
    return await this.accountService.ktmfEmail(member.memberId, data);
  }

  @ApiExcludeEndpoint()
  @ApiCookieAuth('connect.sid')
  @UseGuards(LoggedInGuard)
  @Post('test')
  async test(@MemberDecorator() member, @Res() res) {
    // return HttpStatus.OK;
    // const result = await this.accountService.withdrawal(member.memberId);
    // console.log('########################### delete result : ', result);
    // if (result) {
    //   res.clearCookie('connect.sid', { domain: process.env.DOMAIN, httpOnly: true });
    //   return HttpStatus.OK;
    // } else {
    //   throw new ForbiddenException('회원 탈퇴 실패!!');
    // }
    res.send('OK');
  }
}
