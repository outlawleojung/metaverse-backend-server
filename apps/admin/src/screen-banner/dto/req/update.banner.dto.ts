import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsArray, IsDate } from 'class-validator';

export class BannerReservationInfo {}

export class UpdateBannerReservationDTO {
  @ApiProperty({
    description: '컨텐츠',
    required: false,
    example: 'https://youtube.com/zeldatearsofthekingdom',
  })
  @IsArray()
  @IsOptional()
  public readonly contents: string[] | null;

  @ApiProperty({
    description: '비고',
    required: false,
    example: '젤다의전설',
  })
  @IsOptional()
  @IsString()
  public readonly description: string | null;

  @ApiProperty({
    description: '시작 시간',
    required: false,
    example: '2023-05-20 12:30:00',
  })
  @IsString()
  @IsOptional()
  public readonly startedAt: string | null;

  @ApiProperty({
    description: '종료 시간',
    required: false,
    example: '2023-05-20 12:30:00',
  })
  @IsString()
  @IsOptional()
  public readonly endedAt: string | null;
}
