import { ApiProperty } from '@nestjs/swagger';

export class GetAdminListResponseDto {
  @ApiProperty({
    example: 200,
    description: 'rows',
  })
  public rows: number;

  @ApiProperty({
    example: 200,
    description: 'count',
  })
  public count: number;
}
