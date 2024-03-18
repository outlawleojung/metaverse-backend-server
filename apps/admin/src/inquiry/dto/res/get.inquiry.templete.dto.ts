import { ApiProperty } from '@nestjs/swagger';

export class InquiryTemplateInfo {
  @ApiProperty({
    description: '템플릿 아이디',

    example: 12,
  })
  public readonly id: number;

  @ApiProperty({
    description: '문의 유형',

    example: 2,
  })
  public readonly inquiryType: number;

  @ApiProperty({
    description: '설명',

    example: '결제문의 기본 답변.',
  })
  public readonly description: string;

  @ApiProperty({
    description: '내용',

    example: '답변 내용.. 블라 블라..',
  })
  public readonly content: string;

  @ApiProperty({
    description: '관리자 아이디',

    example: 6,
  })
  public readonly adminId: number;

  @ApiProperty({
    description: '관리자 이름',

    example: '최재쿨',
  })
  public readonly adminName: string;

  @ApiProperty({
    description: '갱신 일시',

    example: '2023-02-15 09:43:23',
  })
  public readonly updatedAt: Date;
}

export class GetInquiryTemplateDto {
  @ApiProperty({
    description: '템플릿 리스트',
    type: InquiryTemplateInfo,
    isArray: true,
  })
  public readonly rows: InquiryTemplateInfo[];

  @ApiProperty({
    description: '전체 템플릿 갯수',
    example: 28,
  })
  public readonly count: number;
}
