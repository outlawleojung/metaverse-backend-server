import { ReportCategory } from './reportCategory.entity';
import { Entity, OneToMany } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('report_reason_type')
export class ReportReasonType extends BaseTypeEntity {
  @OneToMany(() => ReportCategory, (reportcategory) => reportcategory.ReportReasonType)
  ReportCategorise: ReportCategory[];
}
