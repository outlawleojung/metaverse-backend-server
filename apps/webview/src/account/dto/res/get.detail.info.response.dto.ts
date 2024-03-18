import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDate, IsString } from 'class-validator';

export class GetDetailInfoResponseDto {
  @ApiProperty({
    example: '2022-12-31 13:43:12',
    description: '패스워드 업데이트 날짜',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  public readonly passwdUpdatedAt: Date;

  @ApiProperty({
    example: '나의 별명',
    description: '닉네임',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly nickname: string;

  @ApiProperty({
    example: '상태가 안좋다.',
    description: '상태메세지',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly stateMessage: string;
}
