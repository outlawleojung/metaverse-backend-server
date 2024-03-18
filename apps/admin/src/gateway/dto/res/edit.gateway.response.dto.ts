import { ApiProperty } from '@nestjs/swagger';
import { Gateway } from '@libs/entity';

export class EditGateWayResponseDto {
  @ApiProperty({
    type: Gateway,
    description: 'gateWay',
  })
  public gateWay: Gateway;
}
