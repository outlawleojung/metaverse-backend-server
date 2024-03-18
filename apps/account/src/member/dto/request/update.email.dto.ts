import { GetCommonDto } from '../../../dto/get.common.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailDto extends GetCommonDto {
  @ApiProperty({
    example: 'example@hancom.com',
    description: '이메일',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
