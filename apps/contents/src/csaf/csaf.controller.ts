import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { CsafService } from './csaf.service';
import { CreateBannerDto, CreateScreenDto } from './dto/req/create.media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileboxDto } from './dto/req/create.filebox.dto';
import { FileBoxInfo, ResFileBoxDto } from './dto/res/res.filebox.dto';
import { UpdateFileboxDto } from './dto/req/update.filebox.dto';
import { ResGetBoothDto } from './dto/res/res.get.booth.dto';
import { UpdateMediaDto } from './dto/req/update.media.dto';
import { CreateBoothDto } from './dto/req/create.booth.dto';
import { UpdateBoothDto } from './dto/req/update.booth.dto';
import { ResponseCreatBoothDto } from './dto/res/res.create.booth.dto';
import { ResponseBoothsDto } from './dto/res/res.get.booths.dto';
import {
  ResCreateBannerDto,
  ResCreateScreenDto,
} from './dto/res/res.create.media.dto';
import { AccessTokenGuard, MemberDeco, MemberDto } from '@libs/common';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('CSAF - 유학박람회')
@Controller('api/csaf')
export class CsafController {
  constructor(private readonly csafService: CsafService) {}
  private readonly logger = new Logger(CsafController.name);

  @ApiExcludeEndpoint()
  @Get('test')
  async test() {
    return 'hello world';
  }

  @ApiOperation({ summary: '부스 목록 조회' })
  @UseGuards(AccessTokenGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseBoothsDto,
  })
  @Get('booths')
  async getBooths() {
    return await this.csafService.getBooths();
  }

  @ApiOperation({ summary: '부스 항목 조회' })
  @UseGuards(AccessTokenGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResGetBoothDto,
  })
  @Get('booth/:boothId')
  async getBooth(@Param('boothId') boothId: number) {
    return await this.csafService.getBooth(boothId);
  }

  @ApiOperation({ summary: '부스 이름 검색 조회' })
  @UseGuards(AccessTokenGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseBoothsDto,
  })
  @Get('booth-name')
  async getBoothByName(@Query('name') name: string) {
    return await this.csafService.getBoothByName(name);
  }

  @ApiOperation({ summary: '부스 생성' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseCreatBoothDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('booth')
  async createBooth(
    @UploadedFile() file: Express.Multer.File,
    @MemberDeco() member: MemberDto,
    @Body() data: CreateBoothDto,
  ) {
    return await this.csafService.createBooth(file, member.memberId, data);
  }

  @ApiOperation({ summary: '부스 편집' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseCreatBoothDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Put('booth/:boothId')
  async updateBooth(
    @UploadedFile() file: Express.Multer.File,
    @MemberDeco() member: MemberDto,
    @Param('boothId') boothId: number,
    @Body() data: UpdateBoothDto,
  ) {
    return await this.csafService.updateBooth(
      file,
      member.memberId,
      boothId,
      data,
    );
  }

  @ApiOperation({ summary: '부스 삭제' })
  @UseGuards(AccessTokenGuard)
  @Delete('booth/:boothId')
  async deleteBooth(
    @MemberDeco() member: MemberDto,
    @Param('boothId') boothId: number,
  ) {
    return await this.csafService.deleteBooth(member.memberId, boothId);
  }

  @ApiOperation({ summary: '행사 입장' })
  @UseGuards(AccessTokenGuard)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('event')
  async boothEnter(@MemberDeco('memberId') memberId: string) {
    return await this.csafService.evnetEnter(memberId);
  }

  @ApiOperation({ summary: '부스 배너 등록' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResCreateBannerDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('banner')
  async createBoothBanner(
    @UploadedFile() file: Express.Multer.File,
    @MemberDeco() member: MemberDto,
    @Body() data: CreateBannerDto,
  ) {
    return await this.csafService.createBoothBanner(
      file,
      member.memberId,
      data,
    );
  }

  @ApiOperation({ summary: '부스 스크린 등록' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResCreateScreenDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('screen')
  async createBoothScreen(
    @UploadedFile() file: Express.Multer.File,
    @MemberDeco() member: MemberDto,
    @Body() data: CreateScreenDto,
  ) {
    return await this.csafService.createBoothScreen(
      file,
      member.memberId,
      data,
    );
  }

  @ApiOperation({ summary: '부스 배너 편집' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResCreateBannerDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Put('banner/:boothId/:bannerId')
  async updateBoothBanner(
    @UploadedFile() file: Express.Multer.File,
    @MemberDeco() member: MemberDto,
    @Body() data: UpdateMediaDto,
    @Param('boothId') boothId: number,
    @Param('bannerId') bannerId: number,
  ) {
    return await this.csafService.updateBoothBanner(
      file,
      member.memberId,
      boothId,
      bannerId,
      data,
    );
  }

  @ApiOperation({ summary: '부스 스크린 편집' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResCreateScreenDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Put('screen/:boothId/:screenId')
  async updateBoothScreen(
    @UploadedFile() file: Express.Multer.File,
    @MemberDeco() member: MemberDto,
    @Body() data: UpdateMediaDto,
    @Param('boothId') boothId: number,
    @Param('screenId') screenId: number,
  ) {
    return await this.csafService.updateBoothScreen(
      file,
      member.memberId,
      boothId,
      screenId,
      data,
    );
  }

  @ApiOperation({ summary: '부스 배너 삭제' })
  @UseGuards(AccessTokenGuard)
  @Delete('banner/:boothId/:bannerId')
  async deleteBoothBanner(
    @MemberDeco() member: MemberDto,
    @Param('boothId') boothId: number,
    @Param('bannerId') bannerId: number,
  ) {
    return await this.csafService.deleteBoothBanner(
      member.memberId,
      boothId,
      bannerId,
    );
  }

  @ApiOperation({ summary: '부스 스크린 삭제' })
  @UseGuards(AccessTokenGuard)
  @Delete('screen/:boothId/:screenId')
  async deleteBoothScreen(
    @MemberDeco() member: MemberDto,
    @Param('boothId') boothId: number,
    @Param('screenId') screenId: number,
  ) {
    return await this.csafService.deleteBoothScreen(
      member.memberId,
      boothId,
      screenId,
    );
  }

  @ApiOperation({ summary: '파일함 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResFileBoxDto,
  })
  @Get('fileboxes/:boothId')
  async getFileboxes(@Param('boothId') boothId: number) {
    return await this.csafService.getFileboxes(boothId);
  }

  @ApiOperation({ summary: '파일함 등록' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FileBoxInfo,
  })
  @UseGuards(AccessTokenGuard)
  @Post('filebox')
  async createFilebox(
    @MemberDeco() member: MemberDto,
    @Body() data: CreateFileboxDto,
  ) {
    return await this.csafService.createFilebox(member.memberId, data);
  }

  @ApiOperation({ summary: '파일함 편집' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FileBoxInfo,
  })
  @UseGuards(AccessTokenGuard)
  @Put('filebox/:boothId/:fileId')
  async updateFilebox(
    @Body() data: UpdateFileboxDto,
    @MemberDeco() member: MemberDto,
    @Param('boothId') boothId: number,
    @Param('fileId') fileId: number,
  ) {
    return await this.csafService.updateFilebox(
      member.memberId,
      boothId,
      fileId,
      data,
    );
  }

  @ApiOperation({ summary: '파일함 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(AccessTokenGuard)
  @Delete('filebox/:boothId/:fileId')
  async deleteFilebox(
    @MemberDeco() member: MemberDto,
    @Param('boothId') boothId: number,
    @Param('fileId') fileId: number,
  ) {
    return await this.csafService.deleteFilebox(
      member.memberId,
      boothId,
      fileId,
    );
  }
}
