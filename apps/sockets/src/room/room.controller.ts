import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { GetRoomRequestDto } from './dto/get-room-request.dto';
import { CreateRoomRequestDto } from './dto/create-room-request.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getRoom(@Query() req: GetRoomRequestDto) {
    return await this.roomService.getRooms(req);
  }

  @Post()
  async createRoom(@Body() req: CreateRoomRequestDto) {
    return await this.roomService.createRoom(req);
  }
}
