import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoomType } from '../room-type';

export class CreateRoomRequestDto {
  @ApiProperty({
    example: '123231',
    description: '룸 코드',
  })
  @IsString()
  @IsOptional()
  roomCode: string | null;

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
  @IsEnum(RoomType)
  @IsOptional()
  roomType: RoomType | null;

  @ApiProperty({
    example: 'Scene_Room_MyRoom',
    description: '씬 이름',
  })
  @IsString()
  sceneName: string;
}
