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

export class AddVoteResponseDto {
  @ApiProperty({
    type: VoteInfo,
    description: 'rows',
  })
  public rows: VoteInfo;

  @ApiProperty({
    type: Number,
    description: 'count',
  })
  public count: number;
}
