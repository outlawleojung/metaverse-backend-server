import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckNickNameDto {
  @ApiProperty({
    example: '닉네임',
    description: '닉네임',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly nickname: string;
}
