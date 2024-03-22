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
    example: 'MyRoom',
    description: '룸 타입',
  })
  @IsString()
  @IsOptional()
  roomType: string | null;

  @ApiProperty({
    example: '2412232',
    description: '룸 코드',
  })
  @IsString()
  @IsOptional()
  roomCode: string | null;
}
