import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';
import {
  ServerType,
  OsType,
  ServerState,
  StateMessage,
  VoteInfo,
} from '@libs/entity';

export class GetVoteResultInfoResultDto {
  @ApiProperty({
    type: VoteInfo,
    description: 'voteInfo',
  })
  public voteInfo: VoteInfo;

  @ApiProperty({
    example: [{ voteId: 1, voteCount: 1 }],
    description: 'voteCountInfoList',
  })
  public voteCountInfoList: string;

  @ApiProperty({
    example: [{ voteId: 1, voteCount: 1 }],
    description: 'voteInfoExample',
  })
  public voteInfoExample: string;
}
