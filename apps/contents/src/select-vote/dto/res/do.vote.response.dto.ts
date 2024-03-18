import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class DoVoteInfoResponseDto extends SuccessDto {
  @ApiProperty({
    example: [
      {
        itemNum: 2,
      },
    ],
    description: '나의 투표 정보',
  })
  public myVote: string;
}
