import { GetTableDto } from '../common/dto/get.table.dto';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { MemberService } from './member.service';
import { UserDecorator } from '../common/decorators/user.decorator';
import { OfficeGradeType, ProviderType } from '@libs/entity';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { MemberListResponseDto } from './dto/res/get.member.list.response.dto';
import { MemberInfoResponseDto } from './dto/res/get.member.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE_TYPE } from '@libs/constants';
import { GetConstantsResponseDto } from './dto/res/get.constants.response.dto';
import { PaginateMemberDto } from './dto/req/paginate-member.dto';

@ApiTags('MEMBER - 회원')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('test')
  async getAdmins(@Query() dto: PaginateMemberDto) {
    return await this.memberService.paginateMembers(dto);
  }

  // 회원 관련 상수 조회
  @ApiOperation({ summary: '회원 관련 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetConstantsResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('constants')
  async getConstants() {
    return await this.memberService.getConstants();
  }

  // 회원 리스트 조회
  @ApiOperation({ summary: '회원 리스트 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MemberListResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get()
  async getMemberList(@UserDecorator() user, @Query() data: GetTableDto) {
    return await this.memberService.getMemberList(user.id, data);
  }

  // 회원 상세 정보 조회
  @ApiOperation({ summary: '회원 상세 정보 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MemberInfoResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('/:memberId')
  async getMember(@Param('memberId') memberId: string) {
    return await this.memberService.getMember(memberId);
  }

  // 회원 유형 리스트 조회
  @ApiOperation({
    summary: '회원 유형 리스트 조회',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: ProviderType,
  })
  @Get('providerTypes')
  async getProviderTypes() {
    return await this.memberService.getProviderTypes();
  }

  // 오피스 등급 타입 리스트 조회
  @ApiOperation({
    summary: '오피스 등급 타입 리스트 조회',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: OfficeGradeType,
  })
  @Get('officeGradeTypes')
  async getOfficeGradeTypes() {
    return await this.memberService.getOfficeGradeTypes();
  }

  @ApiOperation({
    summary: '회원 오피스 등급 타입 변경',
  })
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @UseGuards(LoggedInGuard)
  @Patch('office-grade-type/:memberId/:type')
  async updateMemberOfficeGradeType(
    @UserDecorator() user,
    @Param('memberId') memberId: string,
    @Param('type') type: number,
  ) {
    return await this.memberService.updateMemberOfficeGradeType(
      user.id,
      memberId,
      type,
    );
  }
}
