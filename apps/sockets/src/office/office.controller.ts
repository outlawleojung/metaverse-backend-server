import { Controller, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OfficeGateway } from './office.gateway';
import { OfficeWebService } from './office.web.service';
import { OfficeDto } from './dto/office.dto';

@Controller('api/office')
export class OfficeController {
  constructor(
    private readonly officeWebService: OfficeWebService,
    private readonly officeGateway: OfficeGateway,
  ) {}

  @ApiOperation({ summary: '실시간 서버 회의실 방 생성 알림' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('/create')
  async createOfficeRoom(@Body() data: OfficeDto) {
    return await this.officeWebService.crreateOfficeRoom(data.roomCode);
  }

  @ApiOperation({ summary: '실시간 서버 회의실 방 삭제 알림' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('/delete')
  async deleteOfficeRoom(@Body() data: OfficeDto) {
    return await this.officeWebService.deleteOfficeRoom(data.roomCode);
  }
}
