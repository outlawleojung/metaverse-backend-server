import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseCreatBoothDto } from './res.create.booth.dto';

export class ResponseBoothsDto {
  @ApiProperty({
    description: '부스 목록',
    isArray: true,
    type: ResponseCreatBoothDto,
  })
  @IsArray()
  public readonly booths: ResponseCreatBoothDto[];
}
