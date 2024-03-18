import { ApiProperty } from '@nestjs/swagger';

export class GetConstantsDto {
  @ApiProperty({
    description: '문의 유형',
    example: [
      {
        type: 1,
        name: '서비스 이용 문의',
      },
      {
        type: 2,
        name: '계정 문의',
      },
      {
        type: 3,
        name: '결제 문의',
      },
    ],
    isArray: true,
  })
  public readonly inquiryType: string;

  @ApiProperty({
    description: '답변 유형',
    example: [
      {
        type: 1,
        name: '답변 대기',
      },
      {
        type: 2,
        name: '답변 완료',
      },
      {
        type: 3,
        name: '보류',
      },
    ],
    isArray: true,
  })
  public readonly answerType: string;
}
