import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: '패스워드',
    required: true,
    example: '12345!@#$%',
  })
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiProperty({
    description: '새 패스워드',
    required: true,
    example: '!@#$%12345',
  })
  @IsString()
  @IsNotEmpty()
  public newPassword: string;
}
