import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, ValidateIf, IsEmail } from 'class-validator';

export class GetMyInquiryResponseDto {
  @ApiProperty({
    description: '문의 아이디',
    example: 102,
  })
  public readonly inquiryId: number;

  @ApiProperty({
    description: '문의 그룹 아이디',
    example: 112,
  })
  public readonly groupId: number;

  @ApiProperty({
    description: '문의 제목',
    example: '로그인 문의',
  })
  public readonly subject: string;

  @ApiProperty({
    description: '문의 타입',
    example: 1,
  })
  public readonly inquiryType: number;

  @ApiProperty({
    description: '문의 타입 이름',
    example: '서비스 이용 문의',
  })
  public readonly inquiryTypeName: string;

  @ApiProperty({
    description: '추가 문의 갯수',
    example: 2,
  })
  public readonly inquiryCount: number;

  @ApiProperty({
    description: '답변 완료 여부',
    example: 0,
  })
  public readonly isAnswered: number;

  @ApiProperty({
    description: '문의 생성 일시',
    example: '2023-02-11 14:32:12',
  })
  public readonly createdAt: Date;

  @ApiProperty({
    description: '이미지 첨부 여부',
    example: 1,
  })
  public readonly isImages: number;
}
