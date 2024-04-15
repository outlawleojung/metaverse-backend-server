import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseCreatBoothDto } from './res.create.booth.dto';

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
    description: '스크린 아이디',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly screenId: number;
}

export class ResGetBoothDto {
  @ApiProperty({
    description: '부스 정보',
    type: ResponseCreatBoothDto,
  })
  @IsObject()
  public readonly booth: ResponseCreatBoothDto;

  @ApiProperty({
    description: '배너 목록',
    isArray: true,
    type: BannerInfo,
  })
  @IsArray()
  public readonly bannerInfos: BannerInfo[];

  @ApiProperty({
    description: '스크린 목록',
    isArray: true,
    type: ScreenInfo,
  })
  @IsArray()
  public readonly screenInfos: ScreenInfo[];
}
