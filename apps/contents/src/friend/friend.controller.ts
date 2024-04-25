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
import {
  AccessTokenGuard,
  MemberDeco,
  MemberDto,
  QueryRunner,
} from '@libs/common';
import { TransactionInterceptor } from '@libs/entity';
import { QueryRunner as QR } from 'typeorm';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('FRIEND - 친구')
@Controller('api/friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  // // 친구 목록 조회
  // @ApiOperation({ summary: '친구 목록 조회' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: GetFriendResponseDto,
  // })
  // @UseGuards(AccessTokenGuard)
  // @Get()
  // async getFriends(@MemberDeco() member: MemberDto) {
  //   return await this.friendService.getFriends(member.id);
  // }

  // 친구 요청 하기
  @ApiOperation({ summary: '친구 요청 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('/requestFriend')
  async requestFriend(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Body() data: FindFriendDto,
  ) {
    return await this.friendService.requestFriend(member.id, data, queryRunner);
  }

  // 친구 요청 목록 조회
  @ApiOperation({ summary: '친구 요청 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetReceivedFriendsResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/getRequestFriends')
  async getRequestFriends(@MemberDeco() member: MemberDto) {
    return await this.friendService.getRequestFriends(member.id);
  }

  // 친구 요청 받은 목록 조회
  @ApiOperation({ summary: '친구 요청 받은 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetReceivedFriendsResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/receiveRequestFriends')
  async receiveRequestFriends(@MemberDeco() member: MemberDto) {
    return await this.friendService.receiveRequestFriends(member.id);
  }

  // 친구 수락 하기
  @ApiOperation({ summary: '친구 수락 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put('/acceptFriend/:friendMemeberCode')
  async acceptFriend(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return await this.friendService.acceptFriend(
      member.id,
      friendMemeberCode,
      queryRunner,
    );
  }

  // 친구 요청 취소 하기
  @ApiOperation({ summary: '친구 요청 취소 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put('/cancelRequestFriend/:friendMemeberCode')
  async cancelRequestFriend(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return await this.friendService.cancelRequestFriend(
      member.id,
      friendMemeberCode,
      queryRunner,
    );
  }

  // 받은 친구 요청 거절 하기
  @ApiOperation({ summary: '받은 친구 요청 거절 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put('/refusalRequestFriend/:friendMemeberCode')
  async refusalRequestFriend(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return this.friendService.refusalRequestFriend(
      member.id,
      friendMemeberCode,
      queryRunner,
    );
  }

  // 친구 차단 하기
  @ApiOperation({ summary: '친구 차단 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('/blockFriend')
  async blockFriend(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Body() data: CommonFriendDto,
  ) {
    return this.friendService.blockFriend(member.id, data, queryRunner);
  }

  // 친구 삭제
  @ApiOperation({ summary: '친구 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete('/deleteFriend/:friendMemeberCode')
  async deleteFriend(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return await this.friendService.deleteFriend(
      member.id,
      friendMemeberCode,
      queryRunner,
    );
  }

  // 친구 차단 해제 하기
  @ApiOperation({ summary: '친구 차단 해제 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put('/releaseBlockFriend/:friendMemeberCode')
  async releaseBlockFriend(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Param('friendMemeberCode') friendMemeberCode: string,
  ) {
    return this.friendService.releaseBlockFriend(
      member.id,
      friendMemeberCode,
      queryRunner,
    );
  }

  // 친구 차단 목록 조회
  @ApiOperation({ summary: '친구 차단 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BlockMembersResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/getBlockFriends')
  async getBlockFriends(@MemberDeco() member: MemberDto) {
    return this.friendService.getBlockFriends(member.id);
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
  @UseInterceptors(TransactionInterceptor)
  @Post('/bookmark')
  async bookmark(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Body() data: CommonFriendDto,
  ) {
    return this.friendService.bookmark(member.id, data, queryRunner);
  }

  // 친구 룸아이디 조회
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
