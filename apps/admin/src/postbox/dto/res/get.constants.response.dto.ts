import { ApiProperty } from '@nestjs/swagger';

export class GetConstantsResponseDto {
  @ApiProperty({
    description: '우편 타입',
    example: [
      {
        type: 1,
        name: '공지',
      },
      {
        type: 2,
        name: '이벤트',
      },
      {
        type: 3,
        name: '보상',
      },
      {
        type: 4,
        name: '구매',
      },
    ],
  })
  public readonly postalType: string;

  @ApiProperty({
    description: '우편 상태',
    example: [
      {
        type: 1,
        name: '발송 예정',
      },
      {
        type: 2,
        name: '발송 완료',
      },
      {
        type: 3,
        name: '보류',
      },
    ],
  })
  public readonly postalState: string;

  @ApiProperty({
    description: '첨부 타입',
    example: [
      {
        type: 1,
        name: '아이템',
      },
      {
        type: 2,
        name: '재화',
      },
      {
        type: 3,
        name: '패키지',
      },
    ],
  })
  public readonly appendType: string;

  @ApiProperty({
    description: '재화 타입',
    example: [
      {
        type: 1,
        name: '무료 재화',
      },
      {
        type: 2,
        name: '반무료 재화',
      },
      {
        type: 3,
        name: '유료 재화',
      },
    ],
  })
  public readonly moneyType: string;

  @ApiProperty({
    description: '우편 이펙트 효과 타입',
    example: [
      {
        type: 1001,
        name: '팝업 기본 연출',
      },
      {
        type: 2001,
        name: '풀 스크린 기본 연출',
      },
    ],
  })
  public readonly postalEffectType: string;
}
