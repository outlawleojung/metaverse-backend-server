import { IsNotEmpty, IsString } from 'class-validator';

export class MemberDto {
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}
