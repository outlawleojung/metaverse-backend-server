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
    example: 3,
    description: '투표 항목 번호',
  })
  @IsNotEmpty()
  @IsNotEmpty()
  public readonly itemNum: number;
}
