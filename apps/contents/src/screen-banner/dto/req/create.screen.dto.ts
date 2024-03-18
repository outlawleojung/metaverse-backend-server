import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsArray, IsDate } from 'class-validator';

export class CreateScreenReservationDTO {
  @ApiProperty({
    description: '스크린 아이디',
    required: true,
    example: 2001,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly screenId: number;

  @ApiProperty({
    description: '스크린 컨텐츠 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly screenContentType: number;

  @ApiProperty({
    description: '컨텐츠',
    required: true,
    example: ['https://youtube.com/zeldatearsofthekingdom', 'https://youtube.com/Nintendo'],
  })
  @IsArray()
  @IsNotEmpty()
  public readonly contents: string[];

  @ApiProperty({
    description: '비고',
    required: true,
    example: '젤다의전설',
  })
  @IsOptional()
  @IsString()
  public readonly description: string;

  @ApiProperty({
    description: '시작 시간',
    required: true,
    example: '2023-05-20 12:30:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly startedAt: string | null;

  @ApiProperty({
    description: '종료 시간',
    required: true,
    example: '2023-05-20 12:30:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly endedAt: string | null;
}
