import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileBoxInfo {
  @ApiProperty({
    example: 1,
    description: '파일 아이디',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly id: number;

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
    description: '파일함 타입',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly fileBoxType: number;

  @ApiProperty({
    example: '서울대 로고 이미지',
    description: '파일 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly fileName: string;

  @ApiProperty({
    example: 'https://arzmeta.net',
    description: '링크',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly link: string;

  @ApiProperty({
    example: '2023-10-14 12:32:12',
    description: '갱신 일시',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly updatedAt: string;
}

export class ResFileBoxDto {
  @ApiProperty({
    description: '파일함 목록',
    isArray: true,
    type: FileBoxInfo,
  })
  @IsArray()
  public readonly fileboxes: FileBoxInfo[];
}
