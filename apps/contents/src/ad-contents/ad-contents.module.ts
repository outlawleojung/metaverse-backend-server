import { Module } from '@nestjs/common';
import { AdContentsController } from './ad-contents.controller';
import { AdContentsService } from './ad-contents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  Member,
  AdContents,
  MemberAdContents,
} from '@libs/entity';
import { CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, AdContents, MemberAdContents]),
    EntityModule,
    CommonModule,
  ],
  controllers: [AdContentsController],
  providers: [AdContentsService],
})
export class AdContentsModule {}
