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
import { Admin } from '@libs/entity';
import { AdminDecorator } from '../common/decorators/admin.decorator';
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
  getUsers(@AdminDecorator() admin) {
    return admin || false;
  }

  @ApiOperation({ summary: '관리자 상세 정보 조회' })
  @UseGuards(new LoggedInGuard())
  @Get('getDetailInfo')
  getUserDetail(@AdminDecorator() admin) {
    return this.userService.getDetailInfo(admin.id);
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
    this.userService.createAdmin(data);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  logIn(@AdminDecorator() admin: Admin) {
    return admin;
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
  async changePassword(
    @AdminDecorator() admin,
    @Body() data: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(admin.id, data);
  }

  @ApiOperation({ summary: '계정 정보 변경' })
  @UseGuards(new LoggedInGuard())
  @Patch('changeAdminInfo')
  async changeAdminInfo(
    @AdminDecorator() admin,
    @Body() data: ChangeAdminInfoDto,
  ) {
    return await this.userService.changeAdminInfo(admin.id, data);
  }
}
