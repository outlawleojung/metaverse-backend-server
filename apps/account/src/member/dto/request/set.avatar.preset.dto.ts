import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNull } from 'typeorm';

export class SetAvatarPreset {
  @ApiProperty({
    example: 1,
    description: '프리셋 타입',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  public readonly presetType: number;

  @ApiProperty({
    example: '나의 이름은',
    description: '닉네임',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  public readonly nickname: string;

  @ApiProperty({
    example: '상태상태~',
    description: '상태 메세지',
    required: true,
  })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  public readonly stateMessage: string | null;
}
