import { Module } from '@nestjs/common';
import { AdContentsController } from './ad-contents.controller';
import { AdContentsService } from './ad-contents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  Member,
  AdContents,
  MemberAdContents,
  AdContentsRepository,
  MemberAdContentsRepository,
  MemberMoneyRepository,
  MemberMoney,
  MoneyType,
} from '@libs/entity';
import { CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      AdContents,
      MemberAdContents,
      MemberMoney,
      MoneyType,
    ]),
    EntityModule,
    CommonModule,
  ],
  controllers: [AdContentsController],
  providers: [
    AdContentsService,
    AdContentsRepository,
    MemberAdContentsRepository,
    MemberMoneyRepository,
  ],
})
export class AdContentsModule {}
