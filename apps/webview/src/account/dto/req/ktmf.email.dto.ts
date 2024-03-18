import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class KtmfEmailDto {
  @ApiProperty({
    example: 'test@email.com',
    description: '이메일',
  })
  @IsString()
  @IsNotEmpty()
  public email: string;
}
