import { ApiProperty } from '@nestjs/swagger';

export class GetScreenBannerConstantsResponseDto {
  @ApiProperty({
    description: '업로드 타입',
    example: [
      {
        type: 1,
        name: '파일',
      },
      {
        type: 2,
        name: 'URL',
      },
    ],
  })
  public readonly uploadType: string;

  @ApiProperty({
    description: '스크린 컨텐츠 타입',
    example: [
      {
        type: 1,
        name: '스토리지 파일',
      },
      {
        type: 2,
        name: '유튜브 URL(일반)',
      },
      {
        type: 3,
        name: '유튜브 URL(라이브)',
      },
    ],
  })
  public readonly screenContentType: string;

  @ApiProperty({
    description: '공간 상세 타입',
    example: [
      {
        type: 1,
        name: '아즈월드',
      },
      {
        type: 2,
        name: '아즈랜드',
      },
      {
        type: 3,
        name: '부산랜드',
      },
      {
        type: 4,
        name: '오피스존',
      },
      {
        type: 5,
        name: '스토어존',
      },
      {
        type: 6,
        name: '광장',
      },
    ],
  })
  public readonly spaceDetailType: string;
}
