import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostIAPGoogleReceiptValidationDto {
  @ApiProperty({
    example:
      'hlhiljgommmodhmnbhpdfpof.AO-J1OzUMmTUJykVDrev0yhMN9oD9Q3zvUUaXez8T23RzbcqUh-4yQYovTyRFJm_p6IcJCzSp-VVLQE45B378Xp5XrS1MYcSXzpl6aniwz5IZT7PN14GFco',
    name: 'purchaseToken',
    description: 'purchaseToken',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly purchaseToken: string;

  @ApiProperty({
    example: 'arzmeta.subscription.android',
    name: 'productId',
    description: 'productId',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly productId: string;

  @ApiProperty({
    example: 'com.hancomfrontis.arzmeta',
    name: 'packageName',
    description: 'packageName',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly packageName: string;
}
