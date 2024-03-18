import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { RoleType } from '@libs/entity';

export class ChangeRoleTypeResponseDto {
  @ApiProperty({
    example: '1',
    description: 'userId',
  })
  @IsNumber()
  @IsNotEmpty()
  public userId: number;

  @ApiProperty({
    type: RoleType,
    description: 'roleType',
  })
  public roleType: RoleType;
}
