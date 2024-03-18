import { Member, SessionInfo } from '@libs/entity';
import { SessionService } from './session.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Member, SessionInfo])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
