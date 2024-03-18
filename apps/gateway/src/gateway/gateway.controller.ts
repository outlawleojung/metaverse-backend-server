import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { GatewayService } from './gateway.service';
import { GetGatewayDto } from './dto/get.gateway.dto';

@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/gateway')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  async getGateway(@Body() data: GetGatewayDto) {
    return await this.gatewayService.getGateway(data);
  }
}
