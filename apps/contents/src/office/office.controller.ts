import { SuccessDto } from './../dto/success.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReservDto } from './dto/request/create.reserv.dto';
import { GetReservResponseDto } from './dto/response/get.reserv.response.dto';
import {
  AccessTokenGuard,
  AzureBlobService,
  MemberDeco,
  MemberDto,
} from '@libs/common';
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
  @UseGuards(AccessTokenGuard)
  @Get('getRoomInfo/:roomCode')
  async getRoomInfo(@Param('roomCode') roomCode: string) {
    return await this.officeService.getRoomInfo(roomCode);
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
  @UseGuards(AccessTokenGuard)
  @Post('checkRoomCodePassword')
  async checkRoomCodePassword(@Body() data: CheckRoomCodePassword) {
    return await this.officeService.checkRoomCodePassword(data);
  }

  // 나의 예약 목록 조회
  @ApiOperation({ summary: '나의 예약 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetReservResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('getReservInfo')
  async getReservInfo(@MemberDeco() member: MemberDto) {
    return await this.officeService.getReservInfo(member.id);
  }

  // 나의 대기 목록 조회
  @ApiOperation({ summary: '나의 대기 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetWaitingResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('getWaitInfo')
  async getWaitInfo(@MemberDeco() member: MemberDto) {
    return await this.officeService.getWaitInfo(member.id);
  }

  // 오피스 예약 하기
  @ApiOperation({ summary: '오피스 예약하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateOfficeResponseDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  @Post('createOfficeReserv')
  async createOfficeReserv(
    @MemberDeco() member: MemberDto,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateReservDto,
  ) {
    const result = await this.officeService.CreateOffice(member.id, file, data);

    return result;
  }

  // 오피스 예약 편집 하기
  @ApiOperation({ summary: '오피스 예약 편집 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateOfficeResponseDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  @Post('updateOfficeReserv/:roomCode')
  async updateOfficeReserv(
    @MemberDeco() member: MemberDto,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpdateReservDto,
    @Param('roomCode') roomCode: string,
  ) {
    const result = await this.officeService.UpdateOffice(
      member.id,
      file,
      roomCode,
      data,
    );

    return result;
  }

  // 오피스 대기 하기
  @ApiOperation({ summary: '오피스 관심 예약 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('waitOfficeReserv')
  async waitOfficeReserv(
    @MemberDeco() member: MemberDto,
    @Body() data: CreateWaitDto,
  ) {
    const result = await this.officeService.waitOfficeReserv(member.id, data);

    return result;
  }

  // 오피스 예약 취소
  @ApiOperation({ summary: '오피스 예약 취소' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteReservResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Delete('deleteReservation/:roomCode')
  async deleteReservation(
    @MemberDeco() member: MemberDto,
    @Param('roomCode') roomCode: string,
  ) {
    return await this.officeService.deleteReservation(member.id, roomCode);
  }

  // 오피스 대기 취소
  @ApiOperation({ summary: '오피스 관심 예약 해제' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteReservResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Delete('deleteWaiting/:roomCode')
  async deleteWaiting(
    @MemberDeco() member: MemberDto,
    @Param('roomCode') roomCode: string,
  ) {
    const result = await this.officeService.deleteWaiting(member.id, roomCode);
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
  @UseGuards(AccessTokenGuard)
  async getIsAdvertisingList() {
    return await this.officeService.getIsAdvertisingList();
  }

  @ApiExcludeEndpoint()
  // 테스트 업로드
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  @Post('upload')
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @MemberDeco() member: MemberDto,
  ) {
    this.logger.debug('memberId : ', member.id);
    this.logger.debug(file);
  }
}
