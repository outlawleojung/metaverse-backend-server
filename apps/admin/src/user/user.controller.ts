import { NotLoggedInGuard } from '../auth/not-logged-in.guard';
import { LoggedInGuard } from '../auth/logged-in.guard';
import {
  Body,
  Controller,
  UseGuards,
  Get,
  Post,
  Res,
  UseInterceptors,
  Logger,
  Patch,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UserService } from './user.service';
import { User } from '@libs/entity';
import { UserDecorator } from '../common/decorators/user.decorator';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import {
  ApiCookieAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { ForgetPasswordDto } from './dto/forget.password.dto';
import { ChangePasswordDto } from './dto/change.password.dto';
import { ChangeAdminInfoDto } from './dto/change.admin.info.dto';
import { CheckEmailDto } from './dto/check.email.dto';

@ApiTags('USER - 로그인')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @ApiOperation({ summary: '관리자 조회' })
  @ApiCookieAuth('connect.sid')
  @Get()
  getUsers(@UserDecorator() user) {
    return user || false;
  }

  @ApiOperation({ summary: '관리자 상세 정보 조회' })
  @UseGuards(new LoggedInGuard())
  @Get('getDetailInfo')
  getUserDetail(@UserDecorator() user) {
    return this.userService.getDetailInfo(user.id);
  }

  @ApiOperation({ summary: '이메일 중복 확인' })
  @Post('checkEmail')
  @UseGuards(new NotLoggedInGuard())
  async checkDuplicateEmail(@Body() data: CheckEmailDto) {
    return this.userService.checkDuplicateEmail(data.email);
  }

  @ApiOperation({ summary: '계정 생성' })
  @Post()
  @UseGuards(new NotLoggedInGuard())
  async createUsers(@Body() data: JoinRequestDto) {
    this.userService.createUsers(data);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  logIn(@UserDecorator() user: User) {
    return user;
  }

  @ApiExcludeEndpoint()
  @Get('/test')
  async getTest() {
    const test = await this.userService.getTest();
    this.logger.debug({ test });
    return test;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  @UseGuards(new LoggedInGuard())
  logOut(@Res() res) {
    res.clearCookie('connect.sid', {
      domain: process.env.DOMAIN,
      httpOnly: true,
    });
    return res.send('ok');
  }

  @ApiOperation({ summary: '패스워드 재설정' })
  @Post('forgetPassword')
  async forgetPassword(@Body() data: ForgetPasswordDto) {
    return await this.userService.forgetPassword(data);
  }

  @ApiOperation({ summary: '패스워드 변경' })
  @UseGuards(new LoggedInGuard())
  @Patch('changePassword')
  async changePassword(@UserDecorator() user, @Body() data: ChangePasswordDto) {
    return await this.userService.changePassword(user.id, data);
  }

  @ApiOperation({ summary: '계정 정보 변경' })
  @UseGuards(new LoggedInGuard())
  @Patch('changeAdminInfo')
  async changeAdminInfo(
    @UserDecorator() user,
    @Body() data: ChangeAdminInfoDto,
  ) {
    return await this.userService.changeAdminInfo(user.id, data);
  }
}
