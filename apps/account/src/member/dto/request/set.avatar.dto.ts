import { GetCommonDto } from '../../../dto/get.common.dto';
import { IsNotEmpty, IsString, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
type Avatar = {
  [key: string]: number;
};

export class SetAvatar extends GetCommonDto {
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
  public readonly avatarInfos: Object;
}
