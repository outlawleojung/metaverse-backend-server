import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: '행사 이름',
    required: true,
    example: '우리동네 대찬치',
  })
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty({
    description: '시작 일시',
    required: true,
    example: '2023-09-27 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly startedAt: string;

  @ApiProperty({
    description: '종료 일시',
    required: true,
    example: '2023-10-27 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly endedAt: string;

  @ApiProperty({
    description: '행사 장소',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  public readonly eventSpaceType: number;

  @ApiProperty({
    description: '호출 타입',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly callType: number;
}
