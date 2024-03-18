import { SuccessDto } from '../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { MemberRaking } from './get.all.ranking.response.dto';

export class GetAllMyRankingResponseDto extends SuccessDto {
  @ApiProperty({
    type: MemberRaking,
    isArray: true,
    description: '전체 랭킹',
  })
  public allRanking: MemberRaking[];

  @ApiProperty({
    type: MemberRaking,
    isArray: true,
    description: '나의 랭킹',
  })
  public myRanking: MemberRaking[];
}
