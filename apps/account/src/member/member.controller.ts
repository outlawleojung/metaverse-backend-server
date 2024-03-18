import { UpdateProfileResponseDto } from './dto/response/update.profile.response.dto';
import { JwtGuard } from '@libs/common';
import { MemberService } from './member.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  Put,
  Delete,
  Get,
  Headers,
} from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { SetAvatar } from './dto/request/set.avatar.dto';
import { SetAvatarPreset } from './dto/request/set.avatar.preset.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ErrorDto } from '../dto/error.response.dto';
import { CheckNickNameDto } from './dto/request/check.nickname.dto';
import { UpdateEmailDto } from './dto/request/update.email.dto';
import { SetAvatarPresetResponseDto } from './dto/response/set.avatar.preset.response.dto';
import { GetMemberInfoResponseDto } from './dto/response/get.member.info.response.dto';
import { ChangePasswordDto } from './dto/request/changepassword.dto';
import { SetAvatarResponseDto } from './dto/response/set.avatar.response.dto';
import { GetCommonDto } from '../dto/get.common.dto';
import { SuccessDto } from '../dto/success.response.dto';
import { GetAppInfoResponseDto } from './dto/response/get.app.info.response.dto';
import { UpdateMyProfileDto } from './dto/request/update.my.profile.dto';
import { UpdateMyCardDto } from './dto/request/update.my.card.dto';
import { SetDefaultCardInfoDto } from './dto/request/set.default.card.info.dto';
import { GetUpdateCardInfoResponseDto } from './dto/response/get.update.card.info.response.dto';
import { CheckWidhDrawalDto } from './dto/request/check.withdrawal.dto';
import { GetMoneyInfoResponseDto } from './dto/response/get.moneyinfo.response.dto';

@ApiTags('MEMBER - 회원')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // 하트비트
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiOperation({ summary: '하트 비트' })
  @UseGuards(JwtGuard)
  @Post('checkLive')
  async checkLive(@Body() checkLive: GetCommonDto) {
    return await this.memberService.checkLive();
  }

  // 탈퇴 진행 여부 확인
  @ApiOperation({ summary: '탈퇴 진행 여부 확인' })
  @Post('check-withdrawal-progress')
  async checkWithdrawal(@Body() data: CheckWidhDrawalDto) {
    return await this.memberService.checkWithdrawalProcess(data);
  }

  // 닉네임 중복 체크
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiOperation({ summary: '닉네임 중복 체크' })
  @Post('checkNickname')
  async checkNickname(@Body() data: CheckNickNameDto) {
    return await this.memberService.checkNickname(data);
  }

  // 명함 업데이트
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUpdateCardInfoResponseDto,
  })
  @ApiOperation({ summary: '명함 업데이트' })
  @UseGuards(JwtGuard)
  @Put('updateMyCard')
  async updateMyCard(@Body() data: UpdateMyCardDto) {
    return await this.memberService.updateMyCardInfo(data);
  }

  //  프로필 업데이트
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateProfileResponseDto,
  })
  @ApiOperation({ summary: '프로필 업데이트' })
  @UseGuards(JwtGuard)
  @Put('updateMyProfile')
  async updateMyProfile(@Body() data: UpdateMyProfileDto) {
    return await this.memberService.updateMyProfile(data);
  }

  // 아바타 파츠 설정
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SetAvatarResponseDto,
  })
  @ApiOperation({ summary: '아바타 파츠 설정' })
  @UseGuards(JwtGuard)
  @Post('avatar')
  async updateAvatar(@Body() data: SetAvatar) {
    return await this.memberService.setAvatar(data);
  }

  // 이메일 변경
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiOperation({ summary: '이메일 변경' })
  @UseGuards(JwtGuard)
  @Put('updateEmail')
  async updateEmail(@Body() data: UpdateEmailDto) {
    return await this.memberService.updateEmail(data);
  }

  // 회원 탈퇴
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiOperation({ summary: '회원 탈퇴' })
  @UseGuards(JwtGuard)
  @Delete('withdrawal')
  async withdrawal(@Body() data: GetCommonDto) {
    return await this.memberService.withdrawal(data);
  }

  // 아바타 프리셋 설정
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SetAvatarPresetResponseDto,
  })
  @ApiOperation({ summary: '아바타 프리셋 설정' })
  @UseGuards(JwtGuard)
  @Post('setAvatarPreset')
  async setAvatarPreset(@Body() data: SetAvatarPreset) {
    return await this.memberService.setAvatarPreset(data);
  }

  // 회원 정보 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetMemberInfoResponseDto,
  })
  @ApiOperation({ summary: '회원 정보 조회' })
  @UseGuards(JwtGuard)
  @Get('getMemberInfo')
  async getMemberInfo(@Body() data: GetCommonDto) {
    return await this.memberService.getMemberInfo(data);
  }

  // 앱 정보 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAppInfoResponseDto,
  })
  @ApiOperation({ summary: '앱 정보 조회' })
  @UseGuards(JwtGuard)
  @Get('getAppInfo')
  async getAppInfo(@Body() data: GetCommonDto) {
    return await this.memberService.getAppInfo(data);
  }

  // 재화 정보 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetMoneyInfoResponseDto,
  })
  @ApiOperation({ summary: '재화 정보 조회' })
  @UseGuards(JwtGuard)
  @Get('get-money-info')
  async getMoneyInfo(@Body() data: GetCommonDto) {
    return await this.memberService.getMoneyInfo(data.memberId);
  }

  // 패스워드 변경
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiOperation({ summary: '패스워드 변경' })
  @UseGuards(JwtGuard)
  @Put('changePassword')
  async changePassword(@Body() changePassword: ChangePasswordDto) {
    return await this.memberService.changePassword(changePassword);
  }

  @ApiOperation({ summary: '기본 명함 설정' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Post('setDefaultCardInfo')
  async setDefaultCardInfo(@Body() data: SetDefaultCardInfoDto) {
    return await this.memberService.setDefaultCardInfo(data);
  }

  @ApiOperation({ summary: '기본 명함 설정 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Delete('delDefaultCardInfo')
  async delDefaultCardInfo(@Body() data: GetCommonDto) {
    return await this.memberService.delDefaultCardInfo(data.memberId);
  }

  @ApiOperation({ summary: '유학박람회 관리자 확인' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Get('get-csaf-admin')
  async getCSAFAdmin(@Headers() headers) {
    return await this.memberService.getCSAFAdmin(headers.memberId);
  }
}
