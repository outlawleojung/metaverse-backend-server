import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSelectVoteDto {
  @ApiProperty({
    description: '결과 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly resultType: number;

  @ApiProperty({
    description: '결과 노출 방식',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly resultExposureType: number;

  @ApiProperty({
    description: 'K-POP 페스티벌 인기 투표',
    required: true,
    example: '투표 이름',
  })
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty({
    description: '투표권 갯수',
    required: true,
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly voteCount: number;

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
