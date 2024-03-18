import { Module } from '@nestjs/common';
import { SelectVoteController } from './select-vote.controller';
import { SelectVoteService } from './select-vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Member,
  SelectVoteInfo,
  MemberSelectVoteInfo,
  SelectVoteItem,
  SessionInfo,
  EntityModule,
} from '@libs/entity';
import { CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      SelectVoteInfo,
      MemberSelectVoteInfo,
      SelectVoteItem,
      SessionInfo,
    ]),
    EntityModule,
    CommonModule,
  ],
  controllers: [SelectVoteController],
  providers: [SelectVoteService],
  exports: [SelectVoteService],
})
export class SelectVoteModule {}
