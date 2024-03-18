import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateSelectVoteItemDto {
  @ApiProperty({
    description: '번호',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public itemNum: number;

  @ApiProperty({
    description: '이름',
    required: false,
    example: '이효리',
  })
  @IsString()
  @IsOptional()
  public name: string | null;

  @ApiProperty({
    description: '설명',
    required: false,
    example: '안녕하쇼! 이효리요!',
  })
  @IsString()
  @IsOptional()
  public description: string | null;

  @ApiProperty({
    description: '동영상 URL',
    required: false,
    example: 'https://youtube.com/블라블라',
  })
  @IsString()
  @IsOptional()
  public videoUrl: string | null;

  @ApiProperty({
    description: '이미지 이름',
    required: false,
    example: '블라블라.png',
  })
  @IsString()
  @IsOptional()
  public imageName: string | null;
}
