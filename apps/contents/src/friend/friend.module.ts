import { CommonModule } from '@libs/common';
import { FriendController } from './friend.controller';
import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  MemberFriendRequest,
  Member,
  MemberFriend,
  MemberRepository,
  SessionInfo,
  MemberFriendRepository,
  MemberFriendRequestRepository,
  MemberBlock,
  MemberBlockRepository,
  FunctionTableRepository,
  FunctionTable,
} from '@libs/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberFriend,
      MemberFriendRequest,
      MemberBlock,
      SessionInfo,
      FunctionTable,
    ]),
    EntityModule,
    CommonModule,
  ],
  controllers: [FriendController],
  providers: [
    FriendService,
    MemberRepository,
    MemberFriendRepository,
    MemberFriendRequestRepository,
    MemberBlockRepository,
    FunctionTableRepository,
  ],
  exports: [FriendService],
})
export class FriendModule {}
