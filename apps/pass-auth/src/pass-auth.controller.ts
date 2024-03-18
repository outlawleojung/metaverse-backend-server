import { Controller, Get } from '@nestjs/common';
import { PassAuthService } from './pass-auth.service';

@Controller()
export class PassAuthController {
  constructor(private readonly passAuthService: PassAuthService) {}

  @Get()
  getHello(): string {
    return this.passAuthService.getHello();
  }
}
