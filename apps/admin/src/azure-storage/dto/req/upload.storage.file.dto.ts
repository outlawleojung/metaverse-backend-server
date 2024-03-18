import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UploadStorageFileDTO {
  @ApiProperty({
    name: 'fileName',
    description: '파일 이름',
    required: false,
    example: '폼종호.jpg',
  })
  @IsNotEmpty()
  @IsString()
  public readonly fileName: string;

  @ApiProperty({
    name: 'imageSize',
    description: '이미지 가로 세로 사이즈',
    required: false,
    example: '1920x1080',
  })
  @IsOptional()
  @IsString()
  public readonly imageSize: string | null;

  @ApiProperty({
    name: 'videoPlayTime',
    description: '동영상 재생 시간',
    required: false,
    example: '00:00:00',
  })
  @IsOptional()
  @IsString()
  public readonly videoPlayTime: string | null;
}
