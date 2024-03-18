import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '@libs/entity';

export class GetRoleTypeListResponseDto {
  @ApiProperty({
    type: RoleType,
    description: 'roleTypes',
  })
  public roleTypes: RoleType;
}
