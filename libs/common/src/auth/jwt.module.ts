import { JwtService } from './jwt.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Member, SessionInfo } from '@libs/entity';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member, SessionInfo])],
  providers: [JwtService, SessionService],
  exports: [JwtService],
})
export class JwtAuthModule {}
