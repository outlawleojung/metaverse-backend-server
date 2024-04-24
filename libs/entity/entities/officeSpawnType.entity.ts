import { Entity, OneToMany } from 'typeorm';
import { OfficeDefaultOption } from './officeDefaultOption.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('office_spawn_type')
export class OfficeSpawnType extends BaseTypeEntity {
  @OneToMany(
    () => OfficeDefaultOption,
    (officedefaultoption) => officedefaultoption.OfficeSpawnType,
  )
  OfficeDefaultOptions: OfficeDefaultOption[];
}
