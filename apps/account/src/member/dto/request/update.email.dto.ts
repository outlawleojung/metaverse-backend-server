import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailDto {
  @ApiProperty({
    example: 'example@hancom.com',
    description: '이메일',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
