import { BaseTypeEntity } from './baseTypeEntity.entity';
import { LicenseTypeInfo } from './licenseTypeInfo.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity('license_function')
export class LicenseFunction extends BaseTypeEntity {
  @OneToMany(() => LicenseTypeInfo, (info) => info.LicenseFunction)
  LicenseTypeInfos: LicenseTypeInfo[];
}
