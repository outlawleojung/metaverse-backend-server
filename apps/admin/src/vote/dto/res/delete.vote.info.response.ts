import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import {
  ServerType,
  OsType,
  ServerState,
  StateMessage,
  VoteInfo,
} from '@libs/entity';

export class DeleteVoteInfoResponseDto {
  @ApiProperty({
    example: 1,
    description: 'voteId',
  })
  public voteId: number;
}
