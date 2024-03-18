import { CommonFriendDto } from './dto/request/common.friend.dto';
import { GetReceivedFriendsResponseDto } from './dto/response/get.received.friends.response.dto';
import { GetFriendResponseDto } from './dto/response/get.friends.response.dto';
import { GetCommonDto } from '../dto/get.common.dto';
import { JwtGuard } from '@libs/common';
import { FriendService } from './friend.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { SuccessDto } from '../dto/success.response.dto';
import { FindFriendResponseDto } from './dto/response/find.friend.response.dto';
import { BlockMembersResponseDto } from './dto/response/block.members.response.dto';
import { FindFriendDto } from './dto/request/find.friend.dto';
import { BookmarkResponseDto } from './dto/response/bookmark.response.dto';
import { GetFriendRoomIdResponseDto } from './dto/response/get.friend.roomid.response.dto';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('FRIEND - 친구')
@Controller('api/friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  // 친구 목록 조회
  @ApiOperation({ summary: '친구 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFriendResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get()
  async getFriends(@Body() data: GetCommonDto) {
    return await this.friendService.getFriends(data);
  }

  // 친구 요청 하기
  @ApiOperation({ summary: '친구 요청 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Post('/requestFriend')
  async requestFriend(@Body() data: FindFriendDto) {
    return await this.friendService.requestFriend(data);
  }

  // 친구 요청 목록 조회
  @ApiOperation({ summary: '친구 요청 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetReceivedFriendsResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('/getRequestFriends')
  async getRequestFriends(@Body() data: GetCommonDto) {
    return await this.friendService.getRequestFriends(data);
  }

  // 친구 요청 받은 목록 조회
  @ApiOperation({ summary: '친구 요청 받은 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetReceivedFriendsResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('/receiveRequestFriends')
  async receiveRequestFriends(@Body() data: GetCommonDto) {
    return await this.friendService.receiveRequestFriends(data);
  }

  // 친구 수락 하기
  @ApiOperation({ summary: '친구 수락 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Put('/acceptFriend/:friendMemeberCode')
  async acceptFriend(
    @Body() data: GetCommonDto,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return await this.friendService.acceptFriend(data, friendMemeberCode);
  }

  // 친구 요청 취소 하기
  @ApiOperation({ summary: '친구 요청 취소 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Put('/cancelRequestFriend/:friendMemeberCode')
  async cancelRequestFriend(
    @Body() data: GetCommonDto,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return await this.friendService.cancelRequestFriend(
      data,
      friendMemeberCode,
    );
  }

  // 친구 요청 거절 하기
  @ApiOperation({ summary: '친구 요청 거절 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Put('/refusalRequestFriend/:friendMemeberCode')
  async refusalRequestFriend(
    @Body() data: GetCommonDto,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return this.friendService.refusalRequestFriend(data, friendMemeberCode);
  }

  // 친구 차단 하기
  @ApiOperation({ summary: '친구 차단 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Post('/blockFriend')
  async blockFriend(@Body() data: CommonFriendDto) {
    return this.friendService.blockFriend(data);
  }

  // 친구 삭제
  @ApiOperation({ summary: '친구 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Delete('/deleteFriend/:friendMemeberCode')
  async deleteFriend(
    @Body() data: GetCommonDto,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return this.friendService.deleteFriend(data, friendMemeberCode);
  }

  // 친구 차단 해제 하기
  @ApiOperation({ summary: '친구 차단 해제 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Put('/releaseBlockFriend/:friendMemeberCode')
  async releaseBlockFriend(
    @Body() data: GetCommonDto,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return this.friendService.releaseBlockFriend(data, friendMemeberCode);
  }

  // 친구 차단 목록 조회
  @ApiOperation({ summary: '친구 차단 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BlockMembersResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('/getBlockFriends')
  async getBlockFriends(@Body() data: GetCommonDto) {
    return this.friendService.getBlockFriends(data);
  }

  // 친구 조회
  @ApiOperation({ summary: '친구 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FindFriendResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('/findFriend/:requestType/:friendId')
  async findFriend(
    @Body() data: GetCommonDto,
    @Param('requestType') requestType: number,
    @Param('friendId') friendId: string,
  ) {
    return this.friendService.findFriend(data, requestType, friendId);
  }

  // 친구 즐겨찾기
  @ApiOperation({ summary: '친구 즐겨찾기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BookmarkResponseDto,
  })
  @UseGuards(JwtGuard)
  @Post('/bookmark')
  async bookmark(@Body() data: CommonFriendDto) {
    return this.friendService.bookmark(data);
  }

  // 친구 조회
  @ApiOperation({ summary: '친구 룸아이디 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFriendRoomIdResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('/findRoomId/:friendMemeberCode')
  async findRoomId(@Param('friendMemeberCode') friendMemeberCode: string) {
    return this.friendService.findRoomId(friendMemeberCode);
  }
}
