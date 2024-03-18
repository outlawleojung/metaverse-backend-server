import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @ApiProperty({
    example: '토큰',
    description: 'jwtToken',
  })
  public token: string;

  @IsString()
  public password: string = '1234';
}
