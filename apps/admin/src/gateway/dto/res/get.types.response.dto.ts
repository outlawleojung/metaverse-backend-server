import { ApiProperty } from '@nestjs/swagger';

export class GetTypesResponseDto {
  @ApiProperty({
    example: [
      {
        type: 1,
        name: 'Android',
        storeUrl: 'https://google.com',
      },
      {
        type: 2,
        name: 'iOS',
        storeUrl: 'https://apple.com',
      },
      {
        type: 3,
        name: 'UnityEditor',
        storeUrl: 'https://unity.com',
      },
    ],
    description: 'osType',
  })
  public osType: string;

  @ApiProperty({
    example: [
      {
        type: 1,
        name: 'DEV',
      },
      {
        type: 2,
        name: 'STAGING',
      },
      {
        type: 3,
        name: 'LIVE',
      },
    ],
    description: 'serverType',
  })
  public serverType: string;

  @ApiProperty({
    example: [
      {
        state: 1,
        name: '활성',
      },
      {
        state: 2,
        name: '비활성',
      },
      {
        state: 3,
        name: '테스트',
      },
      {
        state: 4,
        name: '업데이트 필요',
      },
    ],
    description: 'serverState',
  })
  public serverState: string;

  @ApiProperty({
    example: [
      {
        id: 1,
        message: ' 없음',
      },
      {
        id: 2,
        message: '업데이트가 필요합니다.',
      },
      {
        id: 3,
        message: '점검 중 입니다.',
      },
    ],
    isArray: true,
    description: 'stateMessage',
  })
  public StateMessage: string;
}
