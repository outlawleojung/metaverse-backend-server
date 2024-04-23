import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { AzureBlobService } from '@libs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Admin,
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
      Admin,
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
