import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteLicenseDto {
  @ApiProperty({
    description: '라이선스 아이디 리스트',
    example: [10, 21, 43],
  })
  @IsArray()
  public readonly licenseIds: number[];
}
