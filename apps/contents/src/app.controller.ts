import { ImageAnalysisService } from './services/Image-analysis.service';
import { Controller, Get, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MorganInterceptor } from 'nest-morgan';

@ApiExcludeController()
@UseInterceptors(MorganInterceptor('combined'))
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly imageAnalysisService: ImageAnalysisService,
  ) {}

  private readonly logger = new Logger(AppController.name);

  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @ApiExcludeEndpoint()
  @Post()
  postHello(): string {
    return this.appService.getHello();
  }

  @ApiExcludeEndpoint()
  @UseInterceptors(FileInterceptor('image'))
  @Post('image-test')
  async postVoteRegister(@UploadedFile() file: Express.Multer.File) {
    //로거

    // logger file.buffer을 제외한 나머지 정보를 출력
    const { buffer, ...fileWithoutBuffer } = file;
    this.logger.log(fileWithoutBuffer);

    const result = await this.imageAnalysisService.analyzeImage(file.buffer);
    if (result) {
      //업로드 가능
    }

    return result;
  }

  @ApiExcludeEndpoint()
  @Get('interior-inven')
  async interioInven() {
    return await this.appService.interiorInven();
  }

  @ApiExcludeEndpoint()
  @Get('init-avatar-inven')
  async initAvatarInven() {
    return await this.appService.initAvatarInven();
  }
}
