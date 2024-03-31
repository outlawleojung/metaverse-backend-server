import {
  Controller,
  HttpStatus,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OfficeWebService } from './office.web.service';
import { OfficeDto } from './dto/office.dto';
import { MorganInterceptor } from 'nest-morgan';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('OFFICE - 오피스')
@Controller('api/office')
export class OfficeController {
  constructor(private readonly officeWebService: OfficeWebService) {}

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
