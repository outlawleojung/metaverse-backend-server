import { GetCommonDto } from '../../../dto/get.common.dto';
import { IsNotEmpty, IsString, IsArray, IsObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetDefaultCardInfoDto extends GetCommonDto {
  @ApiProperty({
    example: 1,
    description: '명함 템플릿 아이디',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly templateId: number;

  @ApiProperty({
    example: 3,
    description: '명함 번호',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly num: number;
}
