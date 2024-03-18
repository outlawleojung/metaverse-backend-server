import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFrameImageDto {
  @IsOptional()
  @IsString()
  memberId: string | null;

  @ApiProperty({
    example: 1001,
    description: '아이템 아이디',
    required: false,
  })
  @IsOptional()
  @IsString()
  itemId: string;

  @ApiProperty({
    example: 1,
    description: '아이템 번호',
    required: false,
  })
  @IsOptional()
  @IsString()
  num: string;

  @ApiProperty({
    example: 1,
    description: '액자 이미지 첨부 타입',
    required: false,
  })
  @IsOptional()
  @IsString()
  uploadType: string;

  @ApiProperty({
    example: 'https://google.com/image.png',
    description: '이미지 Url',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl: string;
}
