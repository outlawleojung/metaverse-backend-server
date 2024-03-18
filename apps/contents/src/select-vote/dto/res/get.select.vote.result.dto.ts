import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class GetSelectVoteResultResponseDto extends SuccessDto {
  @ApiProperty({
    example: [
      {
        rank: 1,
        voteId: 9,
        itemNum: 2,
        displayNum: 1,
        name: '윤정이',
        imageName: 'Jisu.jpg',
        voteCount: 3,
        likeCount: 5,
        rate: 50,
      },
      {
        rank: 2,
        voteId: 9,
        itemNum: 1,
        displayNum: 2,
        name: '제니',
        imageName: 'Jenny.jpg',
        voteCount: 2,
        likeCount: 9,
        rate: 33.33,
      },
      {
        rank: 3,
        voteId: 9,
        itemNum: 3,
        displayNum: 3,
        name: '지수',
        imageName: 'Ko-yoon-jung.jpeg',
        voteCount: 1,
        likeCount: 10,
        rate: 16.67,
      },
    ],
    description: '선택 투표 순위 결과',
  })
  public rank: string;

  @ApiProperty({
    example: 1149,
    description: '총 투표 수',
  })
  public voteTotalCount: number;

  @ApiProperty({
    example: 1,
    description: '투표 결과 노출 타입',
  })
  public resultExposureType: number;
}
