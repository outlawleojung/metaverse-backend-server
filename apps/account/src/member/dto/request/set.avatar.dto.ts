import { IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
type Avatar = {
  [key: string]: number;
};

export class SetAvatar {
  @ApiProperty({
    example: {
      '1': 101,
      '2': 201,
    },
    description: '아바타 정보',
    required: true,
  })
  @IsObject()
  @IsNotEmpty()
  public readonly avatarInfos: Avatar;
}
