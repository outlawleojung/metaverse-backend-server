import { Body, Controller, Get, HttpStatus, Param, Post, Query, Render, Res, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { GetPaymentBillingSuccessDto } from './dto/request/payment.billing.success.dto';
import { GetPaymentFailDto } from './dto/request/payment.fail.dto';
import { GetPaymentSuccessDto } from './dto/request/payment.success.dto';
import { PostPaymentVbankWebhookDto } from './dto/request/payment.vbank.webhook.dto';
import { PaymentService } from './payment.service';
import { GetPaymentBillingSuccessParamDto } from './dto/request/payment.billing.success.param.dto';

@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/payments')
@ApiTags('토스페이먼츠 결제')
export class PaymentController {
  constructor(private readonly paymentServer: PaymentService) {}

  // 토스페이먼츠 결제 요청
  @ApiOperation({ summary: '토스페이먼츠 결제 요청' })
  @Get('tosscall/:customerName')
  async getTossPaymentsCall(@Res() res, @Param('customerName') customerName: string) {
    return await this.paymentServer.getTossPaymentsCall(res, customerName);
  }

  // 토스페이먼츠 결제 성공
  @ApiOperation({ summary: '토스페이먼츠 결제 성공' })
  @Get('success')
  async getTossPaymentsSuccess(@Res() res, @Query() data: GetPaymentSuccessDto) {
    return await this.paymentServer.getTossPaymentsSuccess(res, data);
  }

  // 토스페이먼츠 빌링 결제 성공
  @ApiOperation({ summary: '토스페이먼츠 빌링 결제 성공' })
  @Get('billing/success')
  async getTossPaymentsBillingSuccess(@Res() res, @Query() data: GetPaymentBillingSuccessDto) {
    return await this.paymentServer.getTossPaymentsBillingSuccess(res, data);
  }

  // 가상계좌 입금 통보 웹훅
  @ApiOperation({ summary: '가상계좌 입금 통보 웹훅' })
  @Post('vbank')
  async postTossPaymentsVbankWebhook(@Body() data: PostPaymentVbankWebhookDto) {
    return await this.paymentServer.postTossPaymentsVbankWebhook(data);
  }

  //결제 실패 시 호출
  @ApiOperation({ summary: '결제 실패 시 호출' })
  @Get('failed')
  async getTossPaymentsFail(@Res() res, @Query() data: GetPaymentFailDto) {
    return await this.paymentServer.getTossPaymentsFail(res, data);
  }
}
