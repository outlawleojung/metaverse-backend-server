import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthEmailDto {
  @ApiProperty({
    example: 'example@email.com',
    description: '이메일 주소',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
