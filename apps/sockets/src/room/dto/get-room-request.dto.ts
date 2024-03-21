import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetRoomRequestDto {
  @ApiProperty({
    example: '1',
    description: '룸 아이디',
  })
  @IsString()
  @IsOptional()
  roomId: string | null;

  @ApiProperty({
    example: 'DFG4HJ56',
    description: '회원 코드',
  })
  @IsString()
  @IsOptional()
  ownerId: string | null;

  @ApiProperty({
    example: '닉네임이다',
    description: '닉네임',
  })
  @IsString()
  @IsOptional()
  roomType: string | null;
}
