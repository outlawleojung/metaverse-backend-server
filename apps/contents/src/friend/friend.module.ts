import { CommonModule } from '@libs/common';
import { FriendController } from './friend.controller';
import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BlockMember,
  EntityModule,
  FriendRequest,
  Member,
  MemberFriend,
  SessionInfo,
} from '@libs/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberFriend,
      FriendRequest,
      BlockMember,
      SessionInfo,
    ]),
    EntityModule,
    CommonModule,
  ],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
