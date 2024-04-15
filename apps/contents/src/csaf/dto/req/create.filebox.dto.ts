import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFileboxDto {
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
}
