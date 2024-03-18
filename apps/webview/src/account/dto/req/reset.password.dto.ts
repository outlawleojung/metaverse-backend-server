import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResetPasswordtDto {
  @ApiProperty({
    example: 'c447a5d666aa5b61ecc794b22b4007f35f0f701e',
    description: '토큰',
  })
  @IsString()
  @IsNotEmpty()
  public token: string;

  @ApiProperty({
    example: '123344556',
    description: '패스워드',
  })
  @IsString()
  @IsNotEmpty()
  public password: string;
}
