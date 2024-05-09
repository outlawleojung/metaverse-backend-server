import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
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
    example: '우리반',
    description: '룸 이름',
  })
  @IsString()
  @IsOptional()
  roomName: string | null;

  @ApiProperty({
    example: 'DFG4HJ56',
    description: '회원 코드',
  })
  @IsString()
  @IsOptional()
  ownerId: string | null;

  @ApiProperty({
    example: '삼식이',
    description: '닉네임',
  })
  @IsString()
  @IsOptional()
  ownerNickname: string | null;

  @ApiProperty({
    example: 'MyRoom',
    description: '룸 타입',
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

  @ApiProperty({
    example: 20,
    description: '최대 인원 수',
  })
  @IsNumber()
  @IsOptional()
  maxPlayerNumber: number;
}
