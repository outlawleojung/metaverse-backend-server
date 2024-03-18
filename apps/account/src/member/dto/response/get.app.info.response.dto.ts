import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class GetAppInfoResponseDto extends SuccessDto {
  @ApiProperty({
    example: {
      onfContentsInfo: [
        {
          onfContentsType: 0,
          isOn: 0,
        },
        {
          onfContentsType: 1,
          isOn: 0,
        },
      ],
      bannerInfo: [
        {
          bannerId: 211001,
          uploadType: 2,
          contents: 'abab.png',
        },
      ],
      screenInfo: [
        {
          screenId: 21101,
          screenContentType: 3,
          contents: '["https://www.youtube.com/live/QZInKxZmh7Y?feature=share"]',
        },
      ],
      csafEventInfo: {
        id: 4231,
        name: '제 23 회 세계 유학 박람회',
        startedAt: '2023-11-15',
        endedAt: '2023-12-31',
        eventSpaceType: 2,
      },
    },

    description: '앱 정보 : 컨텐츠 온오프 정보, 스크린 정보, 배너 정보',
  })
  public appInfos: string;
}
