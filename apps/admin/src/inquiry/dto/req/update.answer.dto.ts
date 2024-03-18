import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAnswerDto {
  @ApiProperty({
    description: '답변 내용',
    required: true,
    example: '질문에 답변 드립니다.',
  })
  @IsString()
  @IsOptional()
  public readonly content: string | null;

  @ApiProperty({
    description:
      '답변 타입 - 1: 답변대기 / 2: 답변 완료 / 3: 보류 / 4: 예약 발송 ',
    required: true,
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  public readonly answerType: number | null;

  @ApiProperty({
    description: '예약 발송 일시',
    example: 1,
  })
  @IsString()
  @IsOptional()
  public readonly reservationAt: string | null;
}
