import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class GetSelectVoteInfoResponseDto extends SuccessDto {
  @ApiProperty({
    example: {
      id: 9,
      name: '테스트 해본다',
      resultType: 1,
      voteCount: 2,
      remainEnd: '910208',
      remainResultStart: '910208',
      remainResultEnd: '996608',
      startdAt: '2023-07-09 12:00:00',
      endedAt: '2023-08-31 12:00:00',
    },
    description: '선택 투표 정보',
  })
  public selectVoteInfo: string;

  @ApiProperty({
    example: [
      {
        itemNum: 1,
        displayNum: 1,
        name: '제니',
        description: '안녕하쇼! 제니요!',
        videoUrl: 'https://youtube.com/블라블라',
        imageName: 'Jenny.jpg',
        isLike: 0,
        likeCount: 0,
      },
      {
        itemNum: 2,
        displayNum: 2,
        name: '윤정이',
        description: '안녕하쇼! 윤정이요!',
        videoUrl: 'https://youtube.com/블라블라',
        imageName: 'Jisu.jpg',
        isLike: 0,
        likeCount: 0,
      },
      {
        itemNum: 3,
        displayNum: 3,
        name: '지수',
        description: '안녕하쇼! 지수요!',
        videoUrl: 'https://youtube.com/블라블라',
        imageName: 'Ko-yoon-jung.jpeg',
        isLike: 0,
        likeCount: 0,
      },
    ],
    description: '투표 항목 리스트',
  })
  public voteItems: string;

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
