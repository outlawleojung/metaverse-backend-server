import { Module } from '@nestjs/common';
import { PassAuthController } from './pass-auth.controller';
import { PassAuthService } from './pass-auth.service';

@Module({
  imports: [],
  controllers: [PassAuthController],
  providers: [PassAuthService],
})
export class PassAuthModule {}
