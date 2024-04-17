import { UpdateProfileResponseDto } from './dto/response/update.profile.response.dto';
import {
  AccessTokenGuard,
  CommonService,
  MemberDeco,
  MemberDto,
  QueryRunner,
} from '@libs/common';
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
} from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { SetAvatar } from './dto/request/set.avatar.dto';
import { SetAvatarPresetDto } from './dto/request/set.avatar.preset.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ErrorDto } from '../dto/error.response.dto';
import { CheckNickNameDto } from './dto/request/check.nickname.dto';
import { UpdateEmailDto } from './dto/request/update.email.dto';
import { SetAvatarPresetResponseDto } from './dto/response/set.avatar.preset.response.dto';
import { GetMemberInfoResponseDto } from './dto/response/get.member.info.response.dto';
import { ChangePasswordDto } from './dto/request/changepassword.dto';
import { SetAvatarResponseDto } from './dto/response/set.avatar.response.dto';
import { SuccessDto } from '../dto/success.response.dto';
import { GetAppInfoResponseDto } from './dto/response/get.app.info.response.dto';
import { UpdateMyProfileDto } from './dto/request/update.my.profile.dto';
import { UpdateMyCardDto } from './dto/request/update.my.card.dto';
import { SetDefaultCardInfoDto } from './dto/request/set.default.card.info.dto';
import { GetUpdateCardInfoResponseDto } from './dto/response/get.update.card.info.response.dto';
import { CheckWidhDrawalDto } from './dto/request/check.withdrawal.dto';
import { GetMoneyInfoResponseDto } from './dto/response/get.moneyinfo.response.dto';
import { TransactionInterceptor } from '@libs/entity';
import { QueryRunner as QR } from 'typeorm';
import { ERROR_MESSAGE, ERRORCODE } from '@libs/constants';

@ApiTags('MEMBER - 회원')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly commonService: CommonService,
  ) {}

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
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put('updateMyCard')
  async updateMyCard(
    @MemberDeco() member: MemberDto,
    @QueryRunner() queryRunner: QR,
    @Body() data: UpdateMyCardDto,
  ) {
    await this.memberService.updateMyCardInfo(
      member.memberId,
      data,
      queryRunner,
    );

    const businessCardInfos = await this.memberService.getBusinessCardList(
      member.memberId,
      queryRunner,
    );

    return {
      businessCardInfos,
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
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
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put('updateMyProfile')
  async updateMyProfile(
    @MemberDeco() member: MemberDto,
    @QueryRunner() queryRunner: QR,
    @Body() data: UpdateMyProfileDto,
  ) {
    await this.memberService.updateMyProfile(
      member.memberId,
      data,
      queryRunner,
    );

    await this.memberService.updateNicknameLog(
      member.memberId,
      data.nickname,
      queryRunner,
    );

    return {
      nickname: data.nickname,
      statemessage: data.stateMessage,
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
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
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('avatar')
  async updateAvatar(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Body() data: SetAvatar,
  ) {
    await this.memberService.setAvatar(member.memberId, data, queryRunner);
    const avatarInfos = await this.commonService.getAvatarInfo(member.memberId);

    return {
      avatarInfos: avatarInfos,
      error: ERRORCODE.NET_E_SUCCESS,
    };
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
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put('updateEmail')
  async updateEmail(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Body() data: UpdateEmailDto,
  ) {
    return await this.memberService.updateEmail(
      member.memberId,
      data,
      queryRunner,
    );
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
  @UseGuards(AccessTokenGuard)
  @Delete('withdrawal')
  async withdrawal(@MemberDeco() member: MemberDto) {
    return await this.memberService.withdrawal(member.memberId);
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
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('setAvatarPreset')
  async setAvatarPreset(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Body() data: SetAvatarPresetDto,
  ) {
    await this.memberService.setAvatarPreset(
      member.memberId,
      data,
      queryRunner,
    );
    await this.memberService.updateNicknameLog(
      member.memberId,
      data.nickname,
      queryRunner,
    );
    const avatarInfos = await this.commonService.getAvatarInfo(member.memberId);

    return {
      avatarInfos: avatarInfos,
      nickname: data.nickname,
      stateMessage: data.stateMessage,
      error: ERRORCODE.NET_E_SUCCESS,
    };
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
  @UseGuards(AccessTokenGuard)
  @Get('getMemberInfo')
  async getMemberInfo(@MemberDeco() member: MemberDto) {
    return await this.memberService.getMemberInfo(member.memberId);
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
  @UseGuards(AccessTokenGuard)
  @Get('getAppInfo')
  async getAppInfo() {
    return await this.memberService.getAppInfo();
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
  @UseGuards(AccessTokenGuard)
  @Get('get-money-info')
  async getMoneyInfo(@MemberDeco() member: MemberDto) {
    return await this.memberService.getMoneyInfo(member.memberId);
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
  @UseGuards(AccessTokenGuard)
  @Put('changePassword')
  async changePassword(
    @MemberDeco() member: MemberDto,
    @Body() changePassword: ChangePasswordDto,
  ) {
    return await this.memberService.changePassword(
      member.memberId,
      changePassword,
    );
  }

  @ApiOperation({ summary: '기본 명함 설정' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('setDefaultCardInfo')
  async setDefaultCardInfo(
    @MemberDeco() member: MemberDto,
    @Body() data: SetDefaultCardInfoDto,
  ) {
    return await this.memberService.setDefaultCardInfo(member.memberId, data);
  }

  @ApiOperation({ summary: '기본 명함 설정 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @Delete('delDefaultCardInfo')
  async delDefaultCardInfo(@MemberDeco() member: MemberDto) {
    return await this.memberService.delDefaultCardInfo(member.memberId);
  }
}
