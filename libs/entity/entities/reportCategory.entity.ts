import { ApiProperty } from '@nestjs/swagger';
import { MemberReportInfo } from '@libs/entity';
import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ReportType } from './reportType.entity';
import { ReportReasonType } from './reportReasonType.entity';

@Index('reasonType', ['reasonType'], {})
@Entity('report_category')
export class ReportCategory {
  @ApiProperty({
    example: 1,
    description: '신고 유형 타입',
  })
  @PrimaryColumn('int')
  reportType: number;

  @ApiProperty({
    example: 1,
    description: '신고 상세 사유 타입',
  })
  @PrimaryColumn('int')
  reasonType: number;

  @ManyToOne(() => ReportType, (reporttype) => reporttype.ReportCategorise, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'reportType' })
  ReportType: ReportType;

  @ManyToOne(
    () => ReportReasonType,
    (reportreasontype) => reportreasontype.ReportCategorise,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'reasonType' })
  ReportReasonType: ReportReasonType;

  @OneToMany(
    () => MemberReportInfo,
    (memberreportinfo) => memberreportinfo.ReportCategory,
  )
  MemberReportInfos: MemberReportInfo[];
}
