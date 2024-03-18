import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { AzureBlobService } from '@libs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  VoteInfo,
  VoteDivType,
  VoteAlterResType,
  VoteStateType,
  VoteResType,
  VoteResultExposureType,
} from '@libs/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      VoteInfo,
      VoteDivType,
      VoteAlterResType,
      VoteResultExposureType,
      VoteStateType,
      VoteResType,
    ]),
  ],
  controllers: [VoteController],
  providers: [VoteService, AzureBlobService],
})
export class VoteModule {}
