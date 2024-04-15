import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty({
    example: 234112,
    description: '부스 아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly boothId: string;

  @ApiProperty({
    example: 1,
    description: '업로드 타입',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly uploadType: string;

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
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly interactionType: string;

  @ApiProperty({
    example: 'https://arzmeta.net',
    description: '인터랙션 값',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly interactionValue: string;
}

export class CreateBannerDto extends CreateMediaDto {
  @ApiProperty({
    example: 3,
    description: '배너 아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly bannerId: string;
}

export class CreateScreenDto extends CreateMediaDto {
  @ApiProperty({
    example: 3,
    description: '스크린 아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly screenId: string;
}
