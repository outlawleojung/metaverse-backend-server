import { IsNotEmpty, IsString } from 'class-validator';

export class GetCommonDto {
  @IsString()
  @IsNotEmpty()
  public readonly memberId: string;
}
