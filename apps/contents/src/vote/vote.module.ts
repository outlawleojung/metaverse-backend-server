import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  Member,
  MemberVoteInfo,
  OfficeGradeAuthority,
  SessionInfo,
  VoteInfo,
  VoteInfoExample,
} from '@libs/entity';
import { CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      VoteInfo,
      MemberVoteInfo,
      VoteInfoExample,
      SessionInfo,
      OfficeGradeAuthority,
    ]),
    EntityModule,
    CommonModule,
  ],
  providers: [VoteService],
  controllers: [VoteController],
  exports: [VoteService],
})
export class VoteModule {}
