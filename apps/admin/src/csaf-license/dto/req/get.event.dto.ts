import { GetTableDto } from '../../../common/dto/get.table.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class GetEventDto extends GetTableDto {
  @ApiProperty({
    description: '상태 타입',
    required: false,
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  public readonly stateType: number | null;

  @ApiProperty({
    description: '유효 기간',
    required: false,
    example: '164038509|165403947',
  })
  @IsString()
  @IsOptional()
  public readonly searchDateTime: string | null;
}
