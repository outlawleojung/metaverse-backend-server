import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommonFriendDto {
  @ApiProperty({
    example: 'RW25G6U75',
    description: '친구 회원 코드',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly friendMemeberCode: string;
}
