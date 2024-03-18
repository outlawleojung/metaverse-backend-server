import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { PostIAPGoogleReceiptValidationDto } from './dto/request/iap.google.receipt.validation.dto';
import { IapService } from './iap.service';

@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/iap')
@ApiTags('인앱결제 영수증 검증')
export class IapController {
  constructor(private readonly inAppPurchase: IapService) {}

  // 구글 영수증 검증 요청
  @ApiOperation({ summary: '구글 영수증 검증 요청' })
  @Post('google')
  async postIAPGoogleReceiptValidation(
    @Body() data: PostIAPGoogleReceiptValidationDto,
  ) {
    return await this.inAppPurchase.postIAPGoogleReceiptValidation(data);
  }

  //구글 정기 결제 영수증 검증
  @ApiOperation({ summary: '구글 정기 결제 영수증 검증' })
  @Post('google/billing')
  async postIAPGoogleBillingReceiptValidation(
    @Body() data: PostIAPGoogleReceiptValidationDto,
  ) {
    return await this.inAppPurchase.postIAPGoogleBillingReceiptValidation(data);
  }
}
