import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MediaInfo {
  @ApiProperty({
    example: 234112,
    description: '부스 아이디',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly boothId: number;

  @ApiProperty({
    example: 1,
    description: '업로드 타입',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly uploadType: number;

  @ApiProperty({
    example: "'image.png' or 'https://image.co.kr'",
    description: '업로드 값',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly uploadValue: string;

  @ApiProperty({
    example: 1,
    description: '인터랙션 타입',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly interactionType: number;

  @ApiProperty({
    example: 'https://arzmeta.net',
    description: '인터랙션 값',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly interactionValue: string;
}

export class BannerInfo extends MediaInfo {
  @ApiProperty({
    example: 3,
    description: '배너 아이디',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly bannerId: number;
}

export class ScreenInfo extends MediaInfo {
  @ApiProperty({
    example: 3,
    description: '배너 아이디',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly bannerId: number;
}

export class ResCreateBannerDto {
  @ApiProperty({
    description: '배너 정보',
    type: BannerInfo,
  })
  @IsArray()
  public readonly bannerInfo: BannerInfo;
}

export class ResCreateScreenDto {
  @ApiProperty({
    description: '스크린 정보',
    type: ScreenInfo,
  })
  @IsArray()
  public readonly screenInfo: ScreenInfo;
}
