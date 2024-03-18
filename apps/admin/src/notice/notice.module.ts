import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeInfo, User } from '@libs/entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, NoticeInfo])],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
