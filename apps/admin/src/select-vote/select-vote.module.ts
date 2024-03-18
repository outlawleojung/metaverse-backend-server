import { Module } from '@nestjs/common';
import { SelectVoteController } from './select-vote.controller';
import { SelectVoteService } from './select-vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MemberSelectVoteInfo,
  SelectVoteInfo,
  SelectVoteItem,
  User,
} from '@libs/entity';
import { AzureBlobService } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      SelectVoteInfo,
      SelectVoteItem,
      MemberSelectVoteInfo,
    ]),
  ],
  controllers: [SelectVoteController],
  providers: [SelectVoteService, AzureBlobService],
})
export class SelectVoteModule {}
