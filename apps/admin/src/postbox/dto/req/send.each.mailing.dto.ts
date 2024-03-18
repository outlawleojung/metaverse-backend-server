import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';
import { SendFullMailingDto } from './send.full.mailing.dto';

export class SendEachMailingDto extends SendFullMailingDto {
  @ApiProperty({
    description: '회원 아이디',
    required: true,
    example: [
      '0e1cd460-b31c-11ed-9e80-7b6b7d97c65',
      '2c7f4ea0-c92f-11ed-9893-d5465f6f4bf',
    ],
  })
  @IsArray()
  @IsNotEmpty()
  public readonly memberIds: string[];
}
