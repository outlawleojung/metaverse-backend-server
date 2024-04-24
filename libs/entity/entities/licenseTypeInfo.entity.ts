import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { LicenseType } from './licenseType.entity';
import { LicenseFunction } from './licenseFunction.entity';

@Index('licenseFunc', ['licenseFunc'], {})
@Entity('license_type_info')
export class LicenseTypeInfo {
  @PrimaryColumn('int')
  licenseType: number;

  @PrimaryColumn('int')
  licenseFunc: number;

  @Column('int')
  value: number;

  @ManyToOne(() => LicenseType, (type) => type.LicenseTypeInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'licenseType' })
  LicenseType: LicenseType;

  @ManyToOne(() => LicenseFunction, (type) => type.LicenseTypeInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'licenseFunc' })
  LicenseFunction: LicenseFunction;
}
