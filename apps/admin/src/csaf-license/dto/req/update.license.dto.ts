import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateLicenseDto {
  @ApiProperty({
    description: '라이선스 이름',
    required: false,
    example: '서울대미대_2023',
  })
  @IsString()
  @IsOptional()
  public readonly licenseName: string;

  @ApiProperty({
    description: '종료 일시',
    required: false,
    example: '2024-02-23 00:00:00',
  })
  @IsString()
  @IsOptional()
  public readonly endedAt: string;

  @ApiProperty({
    description: '등록 만료 일',
    required: true,
    example: 30,
  })
  @IsNumber()
  @IsOptional()
  public readonly expirationDay: number | null;
}
