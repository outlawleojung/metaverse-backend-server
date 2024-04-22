import { ROLE_TYPE } from '@libs/constants';
import { UserDecorator } from '../common/decorators/user.decorator';
import { AdminService } from './admin.service';
import {
  Controller,
  UseInterceptors,
  Get,
  UseGuards,
  Body,
  HttpStatus,
  Query,
  Patch,
} from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { GetTableDto } from '../common/dto/get.table.dto';
import { User } from '@libs/entity';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from './dto/response/error.response.dto';
import { GetAdminListResponseDto } from './dto/response/getadminlist.response.dto';
import { ChangeRoleTypeDto } from './dto/request/changeroletype.dto';
import { ChangeRoleTypeResponseDto } from './dto/response/changeroletype.response.dto';
import { GetRoleTypeListResponseDto } from './dto/response/getroletypelist.response.dto';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginateAdminDto } from './dto/request/paginate-admin.dto';

@ApiTags('ADMIN - 관리자계정')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('test')
  async getAdmins(@Query() query: PaginateAdminDto) {
    return await this.adminService.paginateAdmins(query);
  }

  // 관리자 타입 상수
  @ApiOperation({ summary: '관리자 타입 상수 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get('constants')
  async getConstants() {
    return await this.adminService.getConstants();
  }

  // 관리자 목록 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAdminListResponseDto,
  })
  @ApiOperation({ summary: '관리자 목록 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get()
  async getAdminList(@UserDecorator() user: User, @Query() data: GetTableDto) {
    return await this.adminService.getAdminList(user.id, data);
  }

  // 관리자 역할 타입 목록 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetRoleTypeListResponseDto,
  })
  @ApiOperation({ summary: '관리자 역할 타입 목록 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get('roleType')
  async getRoleTypeList(@UserDecorator() user: User) {
    return await this.adminService.getRoleTypeList(user.id);
  }

  // 관리자 역할 타입 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetRoleTypeListResponseDto,
  })
  @ApiOperation({ summary: '관리자 역할 타입 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get('searchRoleType')
  async searchRoleType(@UserDecorator() user: User) {
    return await this.adminService.searchRoleType(user.id);
  }

  // 관리자 역할 변경 하기
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChangeRoleTypeResponseDto,
  })
  @ApiOperation({ summary: '관리자 역할 변경 하기' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Patch('changeRoleType')
  async changeRoleType(
    @UserDecorator() user: User,
    @Body() data: ChangeRoleTypeDto,
  ) {
    return await this.adminService.changeRoleType(user.id, data);
  }
}
