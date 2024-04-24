import { Entity, OneToMany } from 'typeorm';
import { OfficeExposure } from './officeExposure.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('office_exposure_type')
export class OfficeExposureType extends BaseTypeEntity {
  @OneToMany(
    () => OfficeExposure,
    (officeexposure) => officeexposure.OfficeExposureType,
  )
  OfficeExposures: OfficeExposure[];
}
