import { ApiProperty } from '@nestjs/swagger';

export class GetMemberResponseDTO {
  @ApiProperty({
    description: '회원 아이디',
    example: '9506a210-6ed6-11ed-f1f-0fb1ed2080',
  })
  public readonly memberId: string;

  @ApiProperty({
    description: '회원 코드',
    example: 'DG41J5FV',
  })
  public readonly memberCode: string;

  @ApiProperty({
    description: '닉네임',
    example: '삼식이',
  })
  public readonly nickname: string;

  @ApiProperty({
    description: '가입 일시',
    example: '2023-04-12 14:20:11',
  })
  public readonly createdAt: string;
}
