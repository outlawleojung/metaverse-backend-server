import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteDomainDto {
  @ApiProperty({
    description: '도메인 아이디 리스트',
    example: [10, 21, 43],
  })
  @IsArray()
  public readonly domainIds: number[];
}
