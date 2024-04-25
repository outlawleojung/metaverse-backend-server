import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { GetRoomRequestDto } from './dto/get-room-request.dto';
import { CreateRoomRequestDto } from './dto/create-room-request.dto';
import { MorganInterceptor } from 'nest-morgan';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard, MemberDeco, MemberDto } from '@libs/common';

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
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '룸 생성' })
  async createRoom(
    @MemberDeco() member: MemberDto,
    @Body() data: CreateRoomRequestDto,
  ) {
    return await this.roomService.createRoom(member.id, data);
  }
}
