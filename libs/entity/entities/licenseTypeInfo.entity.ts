import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { LicenseType } from './licenseType.entity';
import { LicenseFunction } from './licenseFunction.entity';

@Index('licenseFunc', ['licenseFunc'], {})
@Entity('license_type_info')
export class LicenseTypeInfo {
  @PrimaryColumn('int', { name: 'licenseType' })
  licenseType: number;

  @PrimaryColumn('int', { name: 'licenseFunc' })
  licenseFunc: number;

  @Column('int', { name: 'value' })
  value: number;

  @ManyToOne(() => LicenseType, (type) => type.LicenseTypeInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'licenseType', referencedColumnName: 'type' }])
  LicenseType: LicenseType;

  @ManyToOne(() => LicenseFunction, (type) => type.LicenseTypeInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'licenseFunc', referencedColumnName: 'type' }])
  LicenseFunction: LicenseFunction;
}
