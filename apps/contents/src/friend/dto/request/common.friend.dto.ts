import { GetCommonDto } from '../../../dto/get.common.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommonFriendDto extends GetCommonDto {
  @ApiProperty({
    example: 'RW25G6U75',
    description: '친구 회원 코드',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly friendMemeberCode: string;
}
