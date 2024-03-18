import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Logger,
  Body,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AzureStorageService } from './azure-storage.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MorganInterceptor } from 'nest-morgan';
import { GetBlobListDto } from './dto/req/get.blob.list.dto';
import { GetBlobListResponseDto } from './dto/res/get.blob.list.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteBlobDto } from './dto/req/delete.blob.dto';
import { UploadStorageFileDTO } from './dto/req/upload.storage.file.dto';
import { ROLE_TYPE } from '@libs/constants';

@ApiTags('AZURE-STORAGE - Azure Storage')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/azure-storage')
export class AzureStorageController {
  constructor(private azureStorageService: AzureStorageService) {}
  private readonly logger = new Logger(AzureStorageController.name);

  // @ApiOperation({ summary: '스토리지 전체 파일 조회' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   isArray: true,
  //   type: GetBlobListResponseDto,
  // })
  // // @UseGuards(LoggedInGuard)
  // // @Roles()
  // @Get('')
  // async getBlobList() {
  //   return await this.azureStorageService.getBlobList();
  // }

  // @ApiOperation({ summary: '스토리지 폴더 내 파일 조회' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   isArray: true,
  //   type: GetBlobListResponseDto,
  // })
  // // @UseGuards(LoggedInGuard)
  // // @Roles()
  // @Get(':folderName')
  // async getBlobListFolder(@Query('folderName') data: GetBlobListDto) {
  //   return await this.azureStorageService.getBlobListFolder(data);
  // }

  @ApiOperation({ summary: '스토리지 파일 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: GetBlobListResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get('')
  async getBlobList(@Query() data: GetBlobListDto) {
    return await this.azureStorageService.getAzureStorageFileList(data);
  }

  @ApiOperation({ summary: '스토리지 업로드' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload')
  async getBlobUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UploadStorageFileDTO,
  ) {
    return await this.azureStorageService.getBlobUpload(file, data);
  }

  @ApiOperation({ summary: '스토리지 파일 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Post('/delete')
  async getBlobDelete(@Body() file: DeleteBlobDto) {
    return await this.azureStorageService.getBlobDelete(file);
  }
}
