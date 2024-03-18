import { SuccessDto } from './../dto/success.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReservDto } from './dto/request/create.reserv.dto';
import { GetReservResponseDto } from './dto/response/get.reserv.response.dto';
import { GetCommonDto } from '../dto/get.common.dto';
import { JwtGuard, AzureBlobService } from '@libs/common';
import { OfficeService } from './office.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { GetWaitingResponseDto } from './dto/response/get.waiting.dto';
import { CreateWaitDto } from './dto/request/create.wait.dto';
import { CreateOfficeResponseDto } from './dto/response/create.office.response';
import { DeleteReservResponseDto } from './dto/response/delete.reserv.response.dto';
import { GetAdvertisingResponseDto } from './dto/response/get.advertising.response.dto';
import { GetRoomCodeResponseDto } from './dto/response/get.room.code.response.dto';
import { GetRoomInfoResponseDto } from './dto/response/get.room.info.response.dto';
import { CheckRoomCodePassword } from './dto/request/check.roomcode.password.dto';
import { ErrorDto } from '../dto/error.response.dto';
import { OfficeLogService } from '@libs/common';
import { UpdateReservDto } from './dto/request/update.reserv.dto';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('OFFICE - 오피스')
@Controller('api/office')
export class OfficeController {
  constructor(
    private readonly officeService: OfficeService,
    private readonly officeLogService: OfficeLogService,
    private azureBlobService: AzureBlobService,
  ) {}
  private readonly logger = new Logger(OfficeController.name);
  // 룸코드 생성
  @ApiOperation({ summary: '룸코드 생성' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetRoomCodeResponseDto,
  })
  @Post('createRoomCode')
  async createRoomCode() {
    return await this.officeService.createRoomCode();
  }

  // 룸 정보 조회
  @ApiOperation({ summary: '룸 정보 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetRoomInfoResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('getRoomInfo/:roomCode')
  async getRoomInfo(
    @Body() req: GetCommonDto,
    @Param('roomCode') roomCode: string,
  ) {
    return await this.officeService.getRoomInfo(req, roomCode);
  }

  // 룸 코드 / 패스워드 확인
  @ApiOperation({ summary: '룸 코드 / 패스워드 확인' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Post('checkRoomCodePassword')
  async checkRoomCodePassword(@Body() data: CheckRoomCodePassword) {
    return await this.officeService.checkRoomCodePassword(
      data.roomCode,
      data.password,
    );
  }

  // 나의 예약 목록 조회
  @ApiOperation({ summary: '나의 예약 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetReservResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('getReservInfo')
  async getReservInfo(@Body() req: GetCommonDto) {
    return await this.officeService.getReservInfo(req);
  }

  // 나의 대기 목록 조회
  @ApiOperation({ summary: '나의 대기 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetWaitingResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('getWaitInfo')
  async getWaitInfo(@Body() req: GetCommonDto) {
    return await this.officeService.getWaitInfo(req);
  }

  // 오피스 예약 하기
  @ApiOperation({ summary: '오피스 예약하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateOfficeResponseDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtGuard)
  @Post('createOfficeReserv')
  async createOfficeReserv(
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers,
    @Body() req: CreateReservDto,
  ) {
    const result = await this.officeService.CreateOffice(
      file,
      headers.memberId,
      req,
    );
    // this.officeLogService.OfficeReservGenerator(result);
    return result;
  }

  // 오피스 예약 편집 하기
  @ApiOperation({ summary: '오피스 예약 편집 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateOfficeResponseDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtGuard)
  @Post('updateOfficeReserv/:roomCode')
  async updateOfficeReserv(
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers,
    @Body() data: UpdateReservDto,
    @Param('roomCode') roomCode: string,
  ) {
    const result = await this.officeService.UpdateOffice(
      file,
      headers.memberId,
      roomCode,
      data,
    );
    // this.officeLogService.updateOfficeReserv(result);c
    return result;
  }

  // 오피스 대기 하기
  @ApiOperation({ summary: '오피스 관심 예약 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(JwtGuard)
  @Post('waitOfficeReserv')
  async waitOfficeReserv(@Body() req: CreateWaitDto) {
    const result = await this.officeService.waitOfficeReserv(req);
    // this.officeLogService.waitOfficeReserv(result);
    return result;
  }

  // 오피스 예약 취소
  @ApiOperation({ summary: '오피스 예약 취소' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteReservResponseDto,
  })
  @UseGuards(JwtGuard)
  @Delete('deleteReservation/:roomCode')
  async deleteReservation(
    @Body() data: GetCommonDto,
    @Param('roomCode') roomCode: string,
  ) {
    return await this.officeService.deleteReservation(data, roomCode);
  }

  // 오피스 대기 취소
  @ApiOperation({ summary: '오피스 관심 예약 해제' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteReservResponseDto,
  })
  @UseGuards(JwtGuard)
  @Delete('deleteWaiting/:roomCode')
  async deleteWaiting(
    @Body() data: GetCommonDto,
    @Param('roomCode') roomCode: string,
  ) {
    const result = await this.officeService.deleteWaiting(data, roomCode);
    // this.officeLogService.deleteWaiting(result);
    return result;
  }

  // 오피스 홍보 노출 리스트
  @ApiOperation({ summary: '오피스 홍보 노출 리스트' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAdvertisingResponseDto,
  })
  @Get('getIsAdvertisingList')
  @UseGuards(JwtGuard)
  async getIsAdvertisingList(@Body() data: GetCommonDto) {
    return await this.officeService.getIsAdvertisingList();
  }

  // @ApiOperation({ summary: '행사 권한 조회' })
  // @Get('get-exhibition-auth')
  // @UseGuards(JwtGuard)
  // async getExhibitionAith(@Body() data: GetCommonDto) {
  //   return await this.officeService.getExhibitionAuth('3f5570b0-4d3a-11ee-bab1-255021385de7');
  // }

  @ApiExcludeEndpoint()
  // 테스트 업로드
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtGuard)
  @Post('upload')
  async upload(@UploadedFile() file: Express.Multer.File, @Headers() req) {
    this.logger.debug('memberId : ', req.memberId);
    this.logger.debug(req);
    this.logger.debug(file);
  }
}
