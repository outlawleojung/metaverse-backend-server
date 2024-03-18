import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PassService } from './pass.service';
@Controller('pass')
export class PassController {
  constructor(private readonly passService: PassService) {}
  @Get('checkplus_main')
  async getCheckplusMain(@Res() res) {
    return await this.passService.getCheckplusMain(res);
  }
  @Post('checkplus_success')
  async postCheckplusSuccess(@Req() req, @Res() res) {
    return await this.passService.postCheckplusSuccess(req, res);
  }

  @Get('checkplus_success')
  async getCheckplusSuccess(@Req() req, @Res() res) {
    return await this.passService.getCheckplusSuccess(req, res);
  }

  @Post('checkplus_fail')
  async postCheckplusFail(@Req() req, @Res() res) {
    return await this.passService.postCheckplusFail(req, res);
  }
  @Post('123')
  async test(@Req() req, @Res() res) {
    console.log(req.body);
  }
  @Get('checkplus_fail')
  async getCheckplusFail(@Req() req, @Res() res) {
    return await this.passService.getCheckplusFail(req, res);
  }
}
