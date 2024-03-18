import { LoginTokenService } from './login-token.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Member } from '@libs/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [LoginTokenService],
  exports: [LoginTokenService],
})
export class LoginTokenModule {}
