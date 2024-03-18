import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateNoticeDto {
  @ApiProperty({
    description: '공지 사항 타입',
    required: false,
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  public readonly noticeType: number | null;

  @ApiProperty({
    description: '제목',
    required: false,
    example: '결제 시스템 업데이트',
  })
  @IsString()
  @IsOptional()
  public readonly subject: string | null;

  @ApiProperty({
    description: '노출 타입',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  public readonly noticeExposureType: number | null;

  @ApiProperty({
    description: '시작 일시',
    required: false,
    example: '2023-11-01 00:00',
  })
  @IsString()
  @IsOptional()
  public readonly startedAt: string | null;

  @ApiProperty({
    description: '종료 일시',
    required: false,
    example: '2023-11-31 23:59',
  })
  @IsString()
  @IsOptional()
  public readonly endedAt: string | null;

  @ApiProperty({
    description: '한국어 링크',
    required: false,
    example: '한국어',
  })
  @IsString()
  @IsOptional()
  public readonly koLink: string | null;

  @ApiProperty({
    description: '한국어 링크',
    required: false,
    example: '한국어',
  })
  @IsString()
  @IsOptional()
  public readonly enLink: string | null;
}
