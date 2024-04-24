import { Entity, OneToMany } from 'typeorm';
import { ReportCategory } from './reportCategory.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('report_type')
export class ReportType extends BaseTypeEntity {
  @OneToMany(
    () => ReportCategory,
    (reportcategory) => reportcategory.ReportType,
  )
  ReportCategorise: ReportCategory[];
}
