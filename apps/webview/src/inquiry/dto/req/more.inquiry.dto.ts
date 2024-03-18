import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, ValidateIf, IsEmail } from 'class-validator';

export class MoreInquiryDto {
  @ApiProperty({
    description: '문의 그룹 아이디',
    required: true,
    example: 8,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly groupId: number;

  @ApiProperty({
    description: '문의 내용',
    required: true,
    example: '제발 로그인 좀 시켜주세요...',
  })
  @IsString()
  @IsNotEmpty()
  public readonly content: string;

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
