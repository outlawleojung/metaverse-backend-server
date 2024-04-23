import { AdminDecorator } from '../common/decorators/admin.decorator';
import {
  Controller,
  UseInterceptors,
  Get,
  UseGuards,
  Post,
  Body,
  HttpStatus,
  Query,
  Param,
  ForbiddenException,
  Res,
  Patch,
  Delete,
  Logger,
} from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { GetTableDto } from '../common/dto/get.table.dto';
import { Admin } from '@libs/entity';
import { GatewayService } from './gateway.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from './dto/res/error.response.dto';
import { GetGateWayListResponseDto } from './dto/res/get.gateway.list.response.dto';
import { AddGateWayRegisterDto } from './dto/req/add.gateway.register.dto';
import { EditGateWayDto } from './dto/req/edit.gateway.dto';
import { DeleteGateWayDto } from './dto/req/delete.gateway.dto';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { GetTypesResponseDto } from './dto/res/get.types.response.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE_TYPE } from '@libs/constants';

@ApiTags('GATEWAY - 게이트웨이')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/gateway')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}
  private readonly logger = new Logger(GatewayController.name);
  //게이트웨이 리스트 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetGateWayListResponseDto,
  })
  @ApiOperation({ summary: '게이트웨이 리스트 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.DEV_ADMIN)
  @Get()
  async getGatewayList(@AdminDecorator() admin, @Query() data: GetTableDto) {
    console.log('################# 게이트웨이 조회 ####################');
    return await this.gatewayService.getGatewayList(admin.id, data);
  }

  //게이트웨이 추가
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetGateWayListResponseDto,
  })
  @ApiOperation({ summary: '게이트웨이 추가' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.DEV_ADMIN)
  @Post()
  async postGatewayRegister(
    @AdminDecorator() admin: Admin,
    @Body() data: AddGateWayRegisterDto,
    @Res() res,
  ) {
    const result = await this.gatewayService.postGatewayRegister(
      admin.id,
      data,
    );
    if (result) {
      this.logger.debug('success');
      res.redirect(
        HttpStatus.MOVED_PERMANENTLY,
        `/api/gateway?page=1&searchValue=${data.searchValue}&searchType=${data.searchType}&orderType=${data.orderType}&orderValue=${data.orderValue}`,
      );
    } else {
      throw new ForbiddenException();
    }
  }

  //게이트웨이 수정
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetGateWayListResponseDto,
  })
  @ApiOperation({ summary: '게이트웨이 수정' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.DEV_ADMIN)
  @Patch()
  async postGatewayEdit(
    @AdminDecorator() admin: Admin,
    @Body() data: EditGateWayDto,
    @Res() res,
  ) {
    const result = await this.gatewayService.postGatewayEdit(admin.id, data);
    if (result) {
      this.logger.debug('success');
      res.method = 'GET';
      res.redirect(
        HttpStatus.SEE_OTHER,
        `/api/gateway?page=${data.page}&searchValue=${data.searchValue}&searchType=${data.searchType}&orderType=${data.orderType}&orderValue=${data.orderValue}`,
      );
    } else {
      throw new ForbiddenException();
    }
  }

  //게이트웨이 삭제
  @ApiOperation({ summary: '게이트웨이 삭제' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetGateWayListResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.DEV_ADMIN)
  @Delete('/:osType/:appVersion/:page')
  async deleteGateway(
    @AdminDecorator() admin: Admin,
    @Param() data: DeleteGateWayDto,
    @Res() res,
  ) {
    const result = await this.gatewayService.deleteGateway(admin.id, data);
    if (result) {
      this.logger.debug('success');
      res.method = 'GET';
      res.redirect(
        HttpStatus.SEE_OTHER,
        `/api/gateway?page=${data.page}&searchValue=${data.searchValue}&searchType=${data.searchType}&orderType=${data.orderType}&orderValue=${data.orderValue}`,
      );
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiOperation({ summary: '게이트웨이 관련 타입 정보 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetTypesResponseDto,
  })
  @Roles()
  @Get('types')
  async getTtypes() {
    return await this.gatewayService.getTypes();
  }
}
