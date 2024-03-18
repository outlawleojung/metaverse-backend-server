import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMediaDto {
  @ApiProperty({
    example: 1,
    description: '업로드 타입',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly uploadType: string | null;

  @ApiProperty({
    example: "'image.png' or 'https://image.co.kr'",
    description: '업로드 값',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly uploadValue: string | null;

  @ApiProperty({
    example: 1,
    description: '인터랙션 타입',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly interactionType: string | null;

  @ApiProperty({
    example: 'https://arzmeta.net',
    description: '인터랙션 값',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly interactionValue: string | null;
}
