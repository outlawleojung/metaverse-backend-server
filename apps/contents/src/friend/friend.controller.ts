import { CommonFriendDto } from './dto/request/common.friend.dto';
import { GetReceivedFriendsResponseDto } from './dto/response/get.received.friends.response.dto';
import { GetFriendResponseDto } from './dto/response/get.friends.response.dto';
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { SuccessDto } from '../dto/success.response.dto';
import { FindFriendResponseDto } from './dto/response/find.friend.response.dto';
import { BlockMembersResponseDto } from './dto/response/block.members.response.dto';
import { FindFriendDto } from './dto/request/find.friend.dto';
import { BookmarkResponseDto } from './dto/response/bookmark.response.dto';
import { GetFriendRoomIdResponseDto } from './dto/response/get.friend.roomid.response.dto';
import { AccessTokenGuard, MemberDeco } from '@libs/common';

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
  @UseGuards(AccessTokenGuard)
  @Get()
  async getFriends(@MemberDeco('memberId') memberId: string) {
    return await this.friendService.getFriends(memberId);
  }

  // 친구 요청 하기
  @ApiOperation({ summary: '친구 요청 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('/requestFriend')
  async requestFriend(
    @MemberDeco('memberId') memberId: string,
    @Body() data: FindFriendDto,
  ) {
    return await this.friendService.requestFriend(memberId, data);
  }

  // 친구 요청 목록 조회
  @ApiOperation({ summary: '친구 요청 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetReceivedFriendsResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/getRequestFriends')
  async getRequestFriends(@MemberDeco('memberId') memberId: string) {
    return await this.friendService.getRequestFriends(memberId);
  }

  // 친구 요청 받은 목록 조회
  @ApiOperation({ summary: '친구 요청 받은 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetReceivedFriendsResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/receiveRequestFriends')
  async receiveRequestFriends(@MemberDeco('memberId') memberId: string) {
    return await this.friendService.receiveRequestFriends(memberId);
  }

  // 친구 수락 하기
  @ApiOperation({ summary: '친구 수락 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @Put('/acceptFriend/:friendMemeberCode')
  async acceptFriend(
    @MemberDeco('memberId') memberId: string,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return await this.friendService.acceptFriend(memberId, friendMemeberCode);
  }

  // 친구 요청 취소 하기
  @ApiOperation({ summary: '친구 요청 취소 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @Put('/cancelRequestFriend/:friendMemeberCode')
  async cancelRequestFriend(
    @MemberDeco('memberId') memberId: string,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return await this.friendService.cancelRequestFriend(
      memberId,
      friendMemeberCode,
    );
  }

  // 친구 요청 거절 하기
  @ApiOperation({ summary: '친구 요청 거절 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @Put('/refusalRequestFriend/:friendMemeberCode')
  async refusalRequestFriend(
    @MemberDeco('memberId') memberId: string,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return this.friendService.refusalRequestFriend(memberId, friendMemeberCode);
  }

  // 친구 차단 하기
  @ApiOperation({ summary: '친구 차단 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('/blockFriend')
  async blockFriend(
    @MemberDeco('memberId') memberId: string,
    @Body() data: CommonFriendDto,
  ) {
    return this.friendService.blockFriend(memberId, data);
  }

  // 친구 삭제
  @ApiOperation({ summary: '친구 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @Delete('/deleteFriend/:friendMemeberCode')
  async deleteFriend(
    @MemberDeco('memberId') memberId: string,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return this.friendService.deleteFriend(memberId, friendMemeberCode);
  }

  // 친구 차단 해제 하기
  @ApiOperation({ summary: '친구 차단 해제 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @Put('/releaseBlockFriend/:friendMemeberCode')
  async releaseBlockFriend(
    @MemberDeco('memberId') memberId: string,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return this.friendService.releaseBlockFriend(memberId, friendMemeberCode);
  }

  // 친구 차단 목록 조회
  @ApiOperation({ summary: '친구 차단 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BlockMembersResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/getBlockFriends')
  async getBlockFriends(@MemberDeco('memberId') memberId: string) {
    return this.friendService.getBlockFriends(memberId);
  }

  // 친구 조회
  @ApiOperation({ summary: '친구 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FindFriendResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/findFriend/:requestType/:friendId')
  async findFriend(
    @Param('requestType') requestType: number,
    @Param('friendId') friendId: string,
  ) {
    return this.friendService.findFriend(requestType, friendId);
  }

  // 친구 즐겨찾기
  @ApiOperation({ summary: '친구 즐겨찾기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BookmarkResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('/bookmark')
  async bookmark(
    @MemberDeco('memberId') memberId: string,
    @Body() data: CommonFriendDto,
  ) {
    return this.friendService.bookmark(memberId, data);
  }

  // 친구 조회
  @ApiOperation({ summary: '친구 룸아이디 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFriendRoomIdResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/findRoomId/:friendMemeberCode')
  async findRoomId(@Param('friendMemeberCode') friendMemeberCode: string) {
    return this.friendService.findRoomId(friendMemeberCode);
  }
}
