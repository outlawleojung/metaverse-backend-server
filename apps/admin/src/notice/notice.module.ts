import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeInfo, Admin } from '@libs/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, NoticeInfo])],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
