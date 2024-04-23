import { Module } from '@nestjs/common';
import { SelectVoteController } from './select-vote.controller';
import { SelectVoteService } from './select-vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MemberSelectVoteInfo,
  SelectVoteInfo,
  SelectVoteItem,
  Admin,
} from '@libs/entity';
import { AzureBlobService } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      SelectVoteInfo,
      SelectVoteItem,
      MemberSelectVoteInfo,
    ]),
  ],
  controllers: [SelectVoteController],
  providers: [SelectVoteService, AzureBlobService],
})
export class SelectVoteModule {}
