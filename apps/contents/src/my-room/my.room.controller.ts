import { ImageResizeService } from './../services/image-resize.service';
import { ImageAnalysisService } from '../services/Image-analysis.service';
import { MyRoomService } from './my.room.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Optional,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { MemberMyRoomInfo } from '@libs/entity';
import { CreateMyRoomDto } from './dto/request/create.my.room.dto';
import { UpdateStateTypeDto } from './dto/request/update.state.dto';
import { UpdateStateTypeResponseDto } from './dto/response/upadte.state.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateFrameImageDto } from './dto/request/update.frame.image.dto';
import { ERRORCODE, ERROR_MESSAGE } from '@libs/constants';
import { UploadImageResponseDto } from './dto/response/upload.image.response.dto';
import axios from 'axios';
import { AccessTokenGuard, MemberDeco, MemberDto } from '@libs/common';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('MY ROOM - 마이룸')
@Controller('api/myRoom')
export class MyRoomController {
  constructor(
    private readonly myRoomService: MyRoomService,
    private readonly imageAnalysisService: ImageAnalysisService,
    private readonly imageResizeService: ImageResizeService,
  ) {}

  private readonly logger = new Logger(MyRoomController.name);

  @ApiOperation({ summary: '타인의 마이룸 정보 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: MemberMyRoomInfo,
  })
  @UseGuards(AccessTokenGuard)
  @Get('othersRoomList/:othersMemberCode')
  async getOthersRoomList(@Param('othersMemberCode') othersMemberCode: string) {
    return await this.myRoomService.getOthersRoomList(othersMemberCode);
  }

  @ApiOperation({ summary: '마이룸 만들기' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: MemberMyRoomInfo,
  })
  @UseGuards(AccessTokenGuard)
  @Post('create')
  async create(@MemberDeco() member: MemberDto, @Body() data: CreateMyRoomDto) {
    return await this.myRoomService.createMyRoom(member.memberId, data);
  }

  @ApiOperation({ summary: '마이룸 상태 타입 변경' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateStateTypeResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Put('stateType')
  async upateStateType(
    @MemberDeco() member: MemberDto,
    @Body() data: UpdateStateTypeDto,
  ) {
    return await this.myRoomService.updateStateType(member.memberId, data);
  }

  @ApiOperation({ summary: '마이룸 이미지 업로드' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UploadImageResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('frame-image')
  async frameImageUpload(
    @MemberDeco() member: MemberDto,
    @Body() data: UpdateFrameImageDto,
    @UploadedFile() @Optional() file?: Express.Multer.File,
  ) {
    let result;

    const maxWidth = 4200;
    const maxHeight = 4200;
    const maxSizeLimitBytes = 4 * 1024 * 1024; // 4MB

    // 업로드한 파일이 있다면
    if (file) {
      // logger file.buffer을 제외한 나머지 정보를 출력
      const { buffer, ...fileWithoutBuffer } = file;
      this.logger.log(fileWithoutBuffer);

      const tempImage = await this.imageResizeService.resizeImageIfNeeded(
        file.buffer,
        maxWidth,
        maxHeight,
        maxSizeLimitBytes,
      );

      result = await this.imageAnalysisService.analyzeImage(tempImage);
    } else {
      // 이미지 URL로 전달 했다면
      // 이미지 다운로드 받기
      const response = await axios.get(data.imageUrl, {
        responseType: 'arraybuffer',
      });
      if (!/^image\/.+/.test(response.headers['content-type'])) {
        return {
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL),
        };
      }

      console.log(response.data);

      // 해당 이미지 리사이즈
      const imageBuffer = Buffer.from(response.data);
      const resizedImageBuffer =
        await this.imageResizeService.resizeImageIfNeeded(
          imageBuffer,
          maxWidth,
          maxHeight,
          maxSizeLimitBytes,
        );

      result = await this.imageAnalysisService.analyzeImage(resizedImageBuffer);
    }

    if (result.error === ERRORCODE.NET_E_SUCCESS) {
      return await this.myRoomService.uploadIFrameImage(
        member.memberId,
        data,
        file,
      );
    }

    return result;
  }

  @ApiOperation({ summary: '마이룸 이미지 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UploadImageResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Delete('frame-image')
  async delteFrameImage(
    @MemberDeco() member: MemberDto,
    @Query('frameImages') items: string,
  ) {
    return this.myRoomService.deleteFrameImage(member.memberId, items);
  }
}
