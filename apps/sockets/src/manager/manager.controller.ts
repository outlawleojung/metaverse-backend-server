import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ManagerService } from './manager.service';
import { MorganInterceptor } from 'nest-morgan';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('MANAGER - 매니저')
@Controller('api/manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}
  @ApiOperation({ summary: '아즈메타 현재 접속자 수' })
  @ApiResponse({
    status: HttpStatus.OK,
    // type: GetAllMyRankingResponseDto,
  })
  @Get('/currentUsers/:serverType')
  async createOfficeRoom(@Param('serverType') serverType: string) {
    return await this.managerService.getCurrentUsers(serverType);
  }

  @ApiOperation({ summary: '아즈메타 현재 접속자 수' })
  @ApiResponse({
    status: HttpStatus.OK,
    // type: GetAllMyRankingResponseDto,
  })
  @Post('/currentUsers')
  async postCureenUsers(@Body() data: any) {
    console.log(data);
    return await this.managerService.getCurrentUsers(data);
  }
}
