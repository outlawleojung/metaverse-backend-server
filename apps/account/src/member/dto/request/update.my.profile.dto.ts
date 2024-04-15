import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMyProfileDto {
  @ApiProperty({
    example: '내별명이다.',
    description: '닉네임',
  })
  @IsString()
  @IsOptional()
  public readonly nickname: string | null;

  @ApiProperty({
    example: '내 상태다.',
    description: '상태메세지',
  })
  @IsString()
  @IsOptional()
  public readonly stateMessage: string | null;
}
