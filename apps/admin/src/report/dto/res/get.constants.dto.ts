import { ApiProperty } from '@nestjs/swagger';

export class GetConstantsDto {
  @ApiProperty({
    description: '신고 타입',
    example: [
      {
        type: 1,
        name: '비매너 행위',
      },
      {
        type: 2,
        name: '불건전 닉네임',
      },
      {
        type: 3,
        name: '음란 · 청소년 유해 행위',
      },
    ],
    isArray: true,
  })
  public readonly reportType: string;

  @ApiProperty({
    description: '사유 타입',
    example: [
      {
        type: 1,
        name: '채팅 도배 · 욕설',
      },
      {
        type: 2,
        name: '괴롭힘 · 스토킹',
      },
      {
        type: 3,
        name: '사칭',
      },
    ],
    isArray: true,
  })
  public readonly reasonType: string;

  @ApiProperty({
    description: '신고 카테고리 타입',
    example: [
      {
        reportType: 1,
        reasonType: 1,
      },
      {
        reportType: 1,
        reasonType: 2,
      },
      {
        reportType: 1,
        reasonType: 3,
      },
    ],
    isArray: true,
  })
  public readonly reportCategoryType: string;

  @ApiProperty({
    description: '신고 상태 타입',
    example: [
      {
        type: 1,
        name: '신고 접수',
      },
      {
        type: 2,
        name: '확인 완료',
      },
      {
        type: 3,
        name: '제재 검토 요청',
      },
      {
        type: 4,
        name: '제재 완료',
      },
    ],
    isArray: true,
  })
  public readonly reportStateType: string;
}
