import { IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: '닉네임',
    description: '닉네임',
    required: true,
  })
  @IsString()
  public readonly nickname: string;

  @ApiProperty({
    example: '지금은 부재중..',
    description: '상태메세지',
    required: false,
  })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  public readonly stateMessage: string | null;
}
