import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnificationService } from './unification.service';
import { MorganInterceptor } from 'nest-morgan';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('Unification - 매니저')
@Controller('api/Unification')
export class UnificationController {
  constructor(private readonly unificationService: UnificationService) {}
  @ApiOperation({ summary: '아즈메타 현재 접속자 수' })
  @ApiResponse({
    status: HttpStatus.OK,
    // type: GetAllMyRankingResponseDto,
  })
  @Get('/currentUsers/:serverType')
  async createOfficeRoom(@Param('serverType') serverType: string) {
    return await this.unificationService.getCurrentUsers(serverType);
  }

  @ApiOperation({ summary: '아즈메타 현재 접속자 수' })
  @ApiResponse({
    status: HttpStatus.OK,
    // type: GetAllMyRankingResponseDto,
  })
  @Post('/currentUsers')
  async postCureenUsers(@Body() data: any) {
    console.log(data);
    return await this.unificationService.getCurrentUsers(data);
  }
}
