import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetSelelctVoteDetailDto {
  @ApiProperty({
    description: '선택 투표 아이디',
    example: 10,
  })
  @IsNumber()
  public id: number;

  @ApiProperty({
    description: '선택 투표 이름',
    example: '새로운 투표 입니다.',
  })
  @IsNumber()
  public name: string;

  @ApiProperty({
    description: '결과 타입',
    example: 2,
  })
  @IsNumber()
  public resultType: number;

  @ApiProperty({
    description: '결과 타입 이름',
    example: '상시 노출',
  })
  @IsString()
  public resultTypename: string;

  @ApiProperty({
    description: '결과 노출 타입',
    example: 1,
  })
  @IsNumber()
  public resultExposureType: number;

  @ApiProperty({
    description: '결과 노출 타입 이름',
    example: '득표율',
  })
  @IsString()
  public resultExposureTypeName: string;

  @ApiProperty({
    description: '투표권 갯수',
    example: 3,
  })
  @IsNumber()
  public voteCount: number;

  @ApiProperty({
    description: '투표 시작 일시',
    example: '2023-08-01 12:00:00',
  })
  @IsString()
  public startedAt: string;

  @ApiProperty({
    description: '투표 종료 일시',
    example: '2023-08-01 12:00:00',
  })
  @IsString()
  public endedAt: string;

  @ApiProperty({
    description: '결과 노출 시작 일시',
    example: '2023-08-01 12:00:00',
  })
  @IsString()
  public resultStartedAt: string;

  @ApiProperty({
    description: '결과 노출 종료 일시',
    example: '2023-08-01 12:00:00',
  })
  @IsString()
  public resultEndedAt: string;

  @ApiProperty({
    description: '상태 타입',
    example: 3,
  })
  @IsNumber()
  public stateType: number;

  @ApiProperty({
    description: '상태 타입 이름',
    example: '진행중',
  })
  @IsString()
  public stateTypeName: string;
}
