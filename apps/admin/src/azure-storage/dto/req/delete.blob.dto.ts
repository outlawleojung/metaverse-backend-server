import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

export class DeleteBlobDto {
  @ApiProperty({
    description: '삭제할 파일 아이디',
    required: true,
    example: [1, 2, 3, 4, 5],
  })
  @IsArray()
  @IsNotEmpty()
  public readonly fileId: number[];
}
