import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DoVoteDto {
  @ApiProperty({
    example: 134,
    description: '투표 아이디',
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly voteId: number;

  @ApiProperty({
    type: Number,
    isArray: true,
    description: '응답 정보',
  })
  @IsNotEmpty()
  public readonly response: number[];
}
