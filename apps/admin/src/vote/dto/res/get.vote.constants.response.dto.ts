import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import {
  ServerType,
  OsType,
  ServerState,
  StateMessage,
  VoteInfo,
  VoteDivType,
  VoteResType,
  VoteStateType,
  VoteResultExposureType,
  VoteAlterResType,
} from '@libs/entity';

export class GetVoteListResponseDto {
  @ApiProperty({
    type: VoteDivType,
    description: 'voteDivType',
  })
  public voteDivType: VoteDivType;

  @ApiProperty({
    type: VoteResType,
    description: 'voteResType',
  })
  public voteResType: VoteResType;

  @ApiProperty({
    type: VoteAlterResType,
    description: 'voteAlterResType',
  })
  public voteAlterResType: VoteAlterResType;

  @ApiProperty({
    type: VoteResultExposureType,
    description: 'voteResultExposureType',
  })
  public voteResultExposureType: VoteResultExposureType;

  @ApiProperty({
    type: VoteStateType,
    description: 'voteStateType',
  })
  public voteStateType: VoteStateType;
}
