import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetGatewayDto {
  @IsString()
  @IsNotEmpty()
  public readonly appVersion: string;

  @IsNumber()
  @IsNotEmpty()
  public readonly osType: number;

  @IsString()
  public readonly deviceId: string;
}
