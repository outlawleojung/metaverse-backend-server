import {
  Controller,
  UseInterceptors,
  UseGuards,
  Post,
  Body,
  Param,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE_TYPE } from '@libs/constants';
import { UpdatePaymentStateDto } from './dto/req/update.paymentState.dto';
import { GetPaymentStateDto } from './dto/req/get.paymentStateList.dto';
import { GetPaymentStateResponseDto } from './dto/res/get.paymentStateList.response.dto';
import { GetPaymentListResponseDto } from './dto/res/get.paymentList.response.dto';
import { GetPaymentStateTypeListResponseDto } from './dto/res/get.paymentStateTypeList.response.dto';

@ApiTags('Payments - 결제')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: '결제 상태 타입 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPaymentStateTypeListResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('stateType')
  async getPaymenTypetList() {
    return this.paymentsService.getPaymenTypetList();
  }

  @ApiOperation({ summary: '결제 내역 전체 가져오기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPaymentListResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('paymentList')
  async getPaymentList() {
    return this.paymentsService.getPaymentList();
  }

  @ApiOperation({ summary: '결제 상태 내역 전체 가져오기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPaymentStateResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('paymentStateList/:orderId')
  async getPaymentStatus(
    @Param('orderId') getPaymentStateDto: GetPaymentStateDto,
  ) {
    return this.paymentsService.getPaymentStatus(getPaymentStateDto);
  }

  @ApiOperation({ summary: '결제 상태 타입 변경' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPaymentStateResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post('paymentStateType')
  async changePaymentState(
    @Body() updatePaymentStateDto: UpdatePaymentStateDto,
  ) {
    return this.paymentsService.changePaymentState(updatePaymentStateDto);
  }
}
