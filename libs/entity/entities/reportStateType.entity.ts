import { Entity, OneToMany } from 'typeorm';
import { MemberReportInfo } from './memberReportInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('report_state_type')
export class ReportStateType extends BaseTypeEntity {
  @OneToMany(
    () => MemberReportInfo,
    (memberReportInfo) => memberReportInfo.ReportStateType,
  )
  MemberReportInfos: MemberReportInfo[];
}
