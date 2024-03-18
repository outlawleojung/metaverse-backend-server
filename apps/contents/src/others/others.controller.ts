import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { OthersService } from './others.service';
import { JwtGuard } from '@libs/common';
import { GetOthersResponsesDto } from './dto/get.others.response.dto';
import { GetCommonDto } from '../dto/get.common.dto';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('OTHERS - 타인 정보')
@Controller('api/others')
export class OthersController {
  constructor(private readonly othersService: OthersService) {}

  @ApiOperation({ summary: '타인의 정보 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetOthersResponsesDto,
  })
  @UseGuards(JwtGuard)
  @Get('memberInfo')
  async getOthersMemberInfo(
    @Query('type') type: number,
    @Query('othersId') othersId: string,
  ) {
    return await this.othersService.getOthersMemberInfo(type, othersId);
  }
}
