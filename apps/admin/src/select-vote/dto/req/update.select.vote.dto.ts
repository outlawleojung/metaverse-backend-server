import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateSelectVoteDto {
  @ApiProperty({
    description: '결과 타입',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  public readonly resultType: number | null;

  @ApiProperty({
    description: '결과 노출 방식',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  public readonly resultExposureType: number | null;

  @ApiProperty({
    description: '투표권 개수',
    required: false,
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  public readonly voteCount: number | null;

  @ApiProperty({
    description: 'K-POP 페스티벌 인기 투표',
    required: false,
    example: '투표 이름',
  })
  @IsString()
  @IsOptional()
  public readonly name: string | null;

  @ApiProperty({
    description: '투표 시작 일시',
    required: true,
    example: '2021-01-01 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly startedAt: string;

  @ApiProperty({
    description: '투표 종료 일시',
    required: true,
    example: '2021-01-01 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly endedAt: string;

  @ApiProperty({
    description: '결과 노출 시작 일시',
    required: true,
    example: '2021-01-01 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly resultStartedAt: string;

  @ApiProperty({
    description: '결과 노출 종료 일시',
    required: true,
    example: '2021-01-01 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly resultEndedAt: string;
}
