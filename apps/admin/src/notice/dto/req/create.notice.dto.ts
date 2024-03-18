import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({
    description: '공지 사항 타입',
    required: true,
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly noticeType: number;

  @ApiProperty({
    description: '제목',
    required: true,
    example: '결제 시스템 업데이트',
  })
  @IsString()
  @IsNotEmpty()
  public readonly subject: string;

  @ApiProperty({
    description: '노출 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly noticeExposureType: number;

  @ApiProperty({
    description: '시작 일시',
    required: true,
    example: '2023-11-01 00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly startedAt: string;

  @ApiProperty({
    description: '종료 일시',
    required: true,
    example: '2023-11-31 23:59',
  })
  @IsString()
  @IsNotEmpty()
  public readonly endedAt: string;

  @ApiProperty({
    description: '한국어 링크',
    required: true,
    example: '한국어',
  })
  @IsString()
  @IsNotEmpty()
  public readonly koLink: string;

  @ApiProperty({
    description: '한국어 링크',
    required: false,
    example: '한국어',
  })
  @IsString()
  @IsOptional()
  public readonly enLink: string | null;
}
