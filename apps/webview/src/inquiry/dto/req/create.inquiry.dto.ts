import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, ValidateIf, IsEmail } from 'class-validator';

export class CreateInquiryDto {
  @ApiProperty({
    description: '문의 제목',
    required: true,
    example: '로그인이 안된다고요!!',
  })
  @IsString()
  @IsNotEmpty()
  public readonly subject: string;

  @ApiProperty({
    description: '문의 내용',
    required: true,
    example: '제발 로그인 좀 시켜주세요...',
  })
  @IsString()
  @IsNotEmpty()
  public readonly content: string;

  @ApiProperty({
    description: '건의사항',
    required: true,
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly inquiryType: number;

  @ApiProperty({
    description: '이메일 주소',
    required: true,
    example: 'example@email.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty({
    description: '앱버전',
    required: true,
    example: '1.0.0',
  })
  @IsString()
  @IsNotEmpty()
  public readonly appVersion: string;

  @ApiProperty({
    description: '디바이스 모델',
    required: true,
    example: 'iPhone',
  })
  @IsString()
  @IsNotEmpty()
  public readonly deviceModel: string;

  @ApiProperty({
    description: '디바이스 OS',
    required: true,
    example: 'iOS',
  })
  @IsString()
  @IsNotEmpty()
  public readonly deviceOS: string;
}
