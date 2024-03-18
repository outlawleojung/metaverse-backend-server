import { ApiProperty } from '@nestjs/swagger';

export class GetConstantsResponseDto {
  @ApiProperty({
    description: '라이선스 타입',
    example: [
      {
        type: 1,
        name: 'free_type1',
      },
      {
        type: 2,
        name: 'Basic_type1',
      },
      {
        type: 3,
        name: 'Standard_type1',
      },
      {
        type: 4,
        name: 'Pro_type1',
      },
    ],
  })
  public readonly licenseType: string;

  @ApiProperty({
    description: '라이선스 기능',
    example: [
      {
        type: 1,
        name: '오피스 기능',
      },
      {
        type: 2,
        name: '무료 재화 제공',
      },
      {
        type: 3,
        name: '유료 재화 제공',
      },
      {
        type: 4,
        name: '코스튬 제공',
      },
    ],
  })
  public readonly licenseFunction: string;

  @ApiProperty({
    description: '라이선스 타입 정보',
    example: [
      {
        licenseType: 1,
        licenseFunc: 1,
        value: 1,
      },
      {
        licenseType: 2,
        licenseFunc: 1,
        value: 2,
      },
      {
        licenseType: 3,
        licenseFunc: 1,
        value: 3,
      },
      {
        licenseType: 4,
        licenseFunc: 1,
        value: 4,
      },
    ],
  })
  public readonly licenseTypeInfo: string;
}
