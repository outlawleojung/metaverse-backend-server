import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetCommonDto } from '../../../dto/get.common.dto';

export class UpdateFileboxDto extends GetCommonDto {
  @ApiProperty({
    example: 1,
    description: '파일함 타입',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  public readonly fileBoxType: number | null;

  @ApiProperty({
    example: '서울대 로고 이미지',
    description: '파일 이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly fileName: string | null;

  @ApiProperty({
    example: 'https://arzmeta.net',
    description: '링크',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly link: string | null;
}
