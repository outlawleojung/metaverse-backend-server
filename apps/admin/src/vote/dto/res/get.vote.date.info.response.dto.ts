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

export class GetVoteDateInfoResponseDto {
  @ApiProperty({
    example: '2021-08-01',
    description: 'settabledAt',
  })
  public settabledAt: string;
}
