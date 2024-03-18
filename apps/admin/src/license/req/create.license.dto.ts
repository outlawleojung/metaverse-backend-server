import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateLicenseDto {
  @ApiProperty({
    description: '라이선스 이름',
    required: true,
    example: '서울대미대_2023',
  })
  @IsString()
  @IsNotEmpty()
  public readonly licenseName: string;

  @ApiProperty({
    description: '라이선스 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly licenseType: number;

  @ApiProperty({
    description: '도메인 아이디',
    required: true,
    example: 1001,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly domainId: number;

  @ApiProperty({
    description: '시작 일시',
    required: true,
    example: '2023-03-23 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly startedAt: string;

  @ApiProperty({
    description: '종료 일시',
    required: true,
    example: '2024-02-23 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly endedAt: string;

  @ApiProperty({
    description: '등록 만료 일',
    required: false,
    example: 30,
  })
  @IsNumber()
  @IsOptional()
  public readonly expirationDay: number | null;

  @ApiProperty({
    description: '발급 개수',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly issueCount: number;
}
