import { GetCommonDto } from '../../../dto/get.common.dto';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMyProfileDto extends GetCommonDto {
  @ApiProperty({
    example: '내별명이다.',
    description: '닉네임',
  })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  public readonly nickname: string | null;

  @ApiProperty({
    example: '내 상태다.',
    description: '상태메세지',
  })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  public readonly stateMessage: string | null;
}
