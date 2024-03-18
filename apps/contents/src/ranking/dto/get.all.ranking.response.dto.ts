import { SuccessDto } from '../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MemberRaking {
  @ApiProperty({
    example: 2.3241,
    description: '스코어',
  })
  public userScore: number;

  @ApiProperty({
    example: 19,
    description: '랭킹',
  })
  public rank: number;

  @ApiProperty({
    example: `dfei34-hierj429-...`,
    description: '회원 아이디',
  })
  public memberId: string;

  @ApiProperty({
    example: '별명이 뭐게',
    description: '닉네임',
  })
  public nickname: string;
}

export class GetAllRankingResponseDto extends SuccessDto {
  @ApiProperty({
    type: MemberRaking,
    isArray: true,
    description: '전체 랭킹',
  })
  public allRanking: MemberRaking[];
}
