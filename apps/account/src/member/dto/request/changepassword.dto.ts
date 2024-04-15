import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: '패스워드',
    description: '패스워드',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly password: string;

  @ApiProperty({
    example: '새로운 패스워드',
    description: '새로운 패스워드',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly newPassword: string;
}
