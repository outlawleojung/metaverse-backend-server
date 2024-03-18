import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('database')
  async getDatabase() {
    return await this.appService.getDatabase();
  }

  @Get('addEmail')
  async addEmail() {
    // return await this.appService.addEmail();
  }

  @Post('Decrypt')
  async decrypt(@Body() body) {
    return await this.appService.decrypt(body.token);
  }

  @Post('Encrypt')
  async encrypt(@Body() body) {
    return await this.appService.encrypt(body.token);
  }

  @ApiExcludeEndpoint()
  @Post('encrypt-auth')
  async encryptAuth(@Body() body) {
    return await this.appService.encryptAuth(body.jwtAccessToken, body.sessionId);
  }

  @Get('addItem')
  async addItem() {
    // return await this.appService.addItem();
  }

  @Get('sync-member-item')
  async syncMemberItem() {
    // return await this.appService.syncMemberItem();
  }
}
