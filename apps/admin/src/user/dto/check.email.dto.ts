import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckEmailDto {
  @ApiProperty({
    description: '이메일',
    required: true,
    example: 'test@email.com',
  })
  @IsString()
  @IsNotEmpty()
  public email: string;
}
