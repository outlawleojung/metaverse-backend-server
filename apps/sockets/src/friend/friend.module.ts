import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@libs/common';
import { Member, MemberAvatarInfo, MemberFriend } from '@libs/entity';
import { HubSocketModule } from '../hub-socket/hub-socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberFriend, MemberAvatarInfo]),
    CommonModule,
    HubSocketModule,
  ],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
