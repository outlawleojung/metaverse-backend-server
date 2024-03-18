import { ApiProperty } from '@nestjs/swagger';

import {
  ServerType,
  OsType,
  ServerState,
  StateMessage,
  User,
} from '@libs/entity';

export class Gateway {
  @ApiProperty({
    example: 1,
    description: 'osType',
  })
  public osType: number;

  @ApiProperty({
    example: '1.0.1',
    description: 'appVersion',
  })
  public appVersion: string;

  @ApiProperty({
    example: 1,
    description: 'serverType',
  })
  public serverType: number;

  @ApiProperty({
    example: 1,
    description: 'stateType',
  })
  public stateType: number;

  @ApiProperty({
    example: '2023-02-02 15:42:21',
    description: '생성 일시',
  })
  public createdAt: Date;

  @ApiProperty({
    type: OsType,
    description: 'osType',
  })
  public OsType: OsType;

  @ApiProperty({
    type: ServerType,
    description: 'serverType',
  })
  public ServerType: ServerType;

  @ApiProperty({
    type: ServerState,
    description: 'serverState',
  })
  public ServerState: ServerState;

  @ApiProperty({
    type: StateMessage,
    description: 'stateMessage',
  })
  public StateMessage: StateMessage;

  @ApiProperty({
    type: User,
    description: 'Admin',
  })
  public Admin: User;
}

export class GatewayList {
  @ApiProperty({
    type: Gateway,
    isArray: true,
    description: '리스트',
  })
  public rows: Gateway[];

  @ApiProperty({
    example: 23,
    description: '총 갯수',
  })
  public count: number;
}

export class GetGateWayListResponseDto {
  @ApiProperty({
    type: GatewayList,
    description: '게이트웨이 리스트',
  })
  public gatewayList: GatewayList;
}
