import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Member,
  MemberReportInfo,
  ReportReasonType,
  ReportType,
  ReportCategory,
  MemberAccount,
} from '@libs/entity';
import { AzureBlobService, CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberReportInfo,
      ReportType,
      ReportCategory,
      ReportReasonType,
      MemberAccount,
    ]),
    CommonModule,
  ],
  controllers: [ReportController],
  providers: [ReportService, AzureBlobService],
})
export class ReportModule {}
