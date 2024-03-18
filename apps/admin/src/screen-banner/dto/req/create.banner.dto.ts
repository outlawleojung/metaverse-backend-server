import { BannerReservation } from '@libs/entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsDate,
} from 'class-validator';

export class BannerReservationInfo {
  @ApiProperty({
    description: '배너 아이디',
    required: true,
    example: 2001,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly bannerId: number;
}

export class CreateBannerReservationDTO {
  @ApiProperty({
    description: '업로드 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly uploadType: number;

  @ApiProperty({
    description: '컨텐츠',
    required: true,
    example: ['https://youtube.com/zeldatearsofthekingdom'],
  })
  @IsArray()
  @IsNotEmpty()
  public readonly contents: string[];

  @ApiProperty({
    description: '비고',
    required: false,
    example: '젤다의전설',
  })
  @IsOptional()
  @IsOptional()
  public readonly description: string | null;

  @ApiProperty({
    description: '시작 시간',
    required: true,
    example: '2023-05-20 12:30:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly startedAt: string;

  @ApiProperty({
    description: '종료 시간',
    required: true,
    example: '2023-05-20 12:30:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly endedAt: string;

  @ApiProperty({
    description: '배너 아이디 예약  목록',
    isArray: true,
    required: true,
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNotEmpty()
  public readonly bannerReservations: number[];
}
