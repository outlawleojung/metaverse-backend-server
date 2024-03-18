import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ManagerService } from './manager.service';

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
