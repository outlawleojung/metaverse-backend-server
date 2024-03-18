import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, ValidateIf, IsEmail } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: '신고 대상 회원 코드',
    required: true,
    example: 'DIE01A67J',
  })
  @IsString()
  @IsNotEmpty()
  public readonly targetMemberCode: string;

  @ApiProperty({
    description: '신고 내용',
    required: true,
    example: '욕했음',
  })
  @IsString()
  @IsNotEmpty()
  public readonly content: string;

  @ApiProperty({
    description: '신고 유형 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly reportType: number;

  @ApiProperty({
    description: '신고 사유 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly reasonType: number;

  @ApiProperty({
    description: '발생 날짜',
    required: true,
    example: '2023-02-12 17:12:47',
  })
  @IsString()
  @IsNotEmpty()
  public reportedAt: string;
}
