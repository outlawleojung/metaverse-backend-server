import { GetCommonDto } from './../../../dto/get.common.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReleaseLinkedAccountDto extends GetCommonDto {
  @ApiProperty({
    example: '1',
    description: '회원 유형',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly providerType: number;
}
