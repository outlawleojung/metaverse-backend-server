import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MemberReportInfo,
  ReportType,
  User,
  ReportReasonType,
  Member,
  MemberAccount,
  ReportStateType,
  DisciplineReview,
} from '@libs/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      MemberReportInfo,
      ReportType,
      ReportReasonType,
      ReportStateType,
      Member,
      MemberAccount,
      DisciplineReview,
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
