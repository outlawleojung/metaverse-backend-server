import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({
    description: '문의 아이디',
    required: true,
    example: 122,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly inquiryId: number;

  @ApiProperty({
    description: '답변 내용',
    required: true,
    example: '질문에 답변 드립니다.',
  })
  @IsString()
  @IsNotEmpty()
  public readonly content: string;

  @ApiProperty({
    description:
      '답변 타입 - 1: 답변대기 / 2: 답변 완료 / 3: 보류 / 4: 예약 발송 ',
    required: true,
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly answerType: number;

  @ApiProperty({
    description: '예약 발송 일시',
    example: '2023-04-10 09:00:00',
  })
  @IsString()
  @IsOptional()
  public readonly reservationAt: string | null;
}
