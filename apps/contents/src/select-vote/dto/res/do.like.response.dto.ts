import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class DoLikeInfoResponseDto extends SuccessDto {
  @ApiProperty({
    example: [
      {
        itemNum: 1,
        isLike: 0,
        likeCount: 0,
      },
    ],
    description: '좋아요 정보',
  })
  public likeInfo: string;
}
