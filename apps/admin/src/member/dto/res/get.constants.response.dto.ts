import { ApiProperty } from '@nestjs/swagger';

export class GetConstantsResponseDto {
  @ApiProperty({
    description: '회원 유형 타입',
    example: [
      {
        type: 1,
        name: '아즈메타',
      },
      {
        type: 2,
        name: '네이버',
      },
      {
        type: 3,
        name: '구글',
      },
      {
        type: 4,
        name: '애플',
      },
    ],
  })
  public readonly providerType: string;

  @ApiProperty({
    description: '가입 경로 타입',
    example: [
      {
        type: 1,
        name: 'AOS',
      },
      {
        type: 2,
        name: 'iOS',
      },
      {
        type: 3,
        name: 'Web',
      },
      {
        type: 4,
        name: 'Etc',
      },
    ],
  })
  public readonly regPathType: string;
}
