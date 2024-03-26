import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { GetRoomRequestDto } from './dto/get-room-request.dto';
import { CreateRoomRequestDto } from './dto/create-room-request.dto';
import { MorganInterceptor } from 'nest-morgan';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('ROOM - 룸')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @ApiOperation({ summary: '룸 조회' })
  async getRoom(@Query() req: GetRoomRequestDto) {
    return await this.roomService.getRooms(req);
  }

  @Post()
  @ApiOperation({ summary: '룸 생성' })
  async createRoom(@Body() req: CreateRoomRequestDto) {
    return await this.roomService.createRoom(req);
  }
}
