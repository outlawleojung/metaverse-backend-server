import { SuccessDto } from './../../../dto/success.response.dto';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPostboxesResponseDto extends SuccessDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        subject: '테스트 발송',
        summary: '테스트 발송 하기',
        content: '테스트 발송 발송',
        postalTypeName: '공지',
        period: 172800,
        createdAt: '2023-05-08T04:40:15.000Z',
        sendedAt: '2023-05-08T04:40:12.000Z',
        items: [
          {
            appendType: 1,
            appendValue: 230006,
            count: 1,
            orderNum: 1,
          },
        ],
      },
    ],
    description: '우편 목록',
  })
  @IsNumber()
  @IsArray()
  public postboxes: string[];
}
