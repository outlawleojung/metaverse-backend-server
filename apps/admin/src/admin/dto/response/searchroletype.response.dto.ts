import { ApiProperty } from '@nestjs/swagger';

export class SearchRoleTypeResponseDto {
  @ApiProperty({
    example: {
      roleTypes: [
        {
          type: 1,
          name: '슈퍼 관리자',
        },
        {
          type: 2,
          name: '일반 관리자',
        },
        {
          type: 3,
          name: '미인증 관리자',
        },
      ],
    },
    description: 'roleTypes',
  })
  public roleTypes: string;
}
