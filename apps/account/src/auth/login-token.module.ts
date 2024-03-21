import { LoginTokenService } from './login-token.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Member } from '@libs/entity';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), AuthModule],
  providers: [LoginTokenService],
  exports: [LoginTokenService],
})
export class LoginTokenModule {}
