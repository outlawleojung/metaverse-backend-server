import { ApiProperty } from '@nestjs/swagger';
import { GetCommonDto } from '../../../dto/get.common.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DoVoteDto extends GetCommonDto {
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
