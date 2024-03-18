import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateInquiryTemplateDto {
  @ApiProperty({
    description: '문의 유형',
    required: true,
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly inquiryType: number;

  @ApiProperty({
    description: '설명',
    required: true,
    example: '결제문의 기본 답변.',
  })
  @IsString()
  @IsNotEmpty()
  public readonly description: string;

  @ApiProperty({
    description: '이름',
    required: true,
    example: '결제문의 기본 1',
  })
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty({
    description: '내용',
    required: true,
    example: '답변 내용.. 블라 블라..',
  })
  @IsString()
  @IsNotEmpty()
  public readonly content: string;
}
