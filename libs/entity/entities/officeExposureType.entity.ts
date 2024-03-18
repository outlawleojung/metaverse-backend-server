import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OfficeExposure } from './officeExposure.entity';

@Entity('office_exposure_type')
export class OfficeExposureType {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 20 })
  name: string;

  @OneToMany(() => OfficeExposure, (officeexposure) => officeexposure.OfficeExposureType)
  OfficeExposures: OfficeExposure[];
}
