import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindFriendDto {
  @ApiProperty({
    example: '{memeberCode} or {nickanme}',
    description: '친구 식별자',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly friendId: string;

  @ApiProperty({
    example: '1: memberCode, 2: nickname',
    description: '요청 타입',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly requestType: number;
}
