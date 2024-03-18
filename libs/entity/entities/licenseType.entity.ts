import { LicenseGroupInfo } from './licenseGroupInfo.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { LicenseTypeInfo } from './licenseTypeInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('license_type')
export class LicenseType extends BaseTypeEntity {
  @OneToMany(() => LicenseTypeInfo, (type) => type.LicenseType)
  LicenseTypeInfos: LicenseTypeInfo[];

  @OneToMany(() => LicenseGroupInfo, (info) => info.LicenseType)
  LicenseGroupInfos: LicenseGroupInfo[];
}
