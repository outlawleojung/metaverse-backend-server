import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateInquiryTemplateDto {
  @ApiProperty({
    description: '문의 유형',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  public readonly inquiryType: number | null;

  @ApiProperty({
    description: '설명',
    example: '결제문의 기본 답변.',
  })
  @IsString()
  @IsOptional()
  public readonly description: string | null;

  @ApiProperty({
    description: '이름',
    example: '결제문의 기본 1',
  })
  @IsString()
  @IsOptional()
  public readonly name: string | null;

  @ApiProperty({
    description: '내용',
    example: '답변 내용.. 블라 블라..',
  })
  @IsString()
  @IsOptional()
  public readonly content: string | null;
}
