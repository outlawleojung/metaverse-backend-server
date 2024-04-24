import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OfficeExposureType } from './officeExposureType.entity';
import { OfficeModeType } from './officeModeType.entity';

@Index('modeType', ['modeType'], {})
@Entity('office_exposure')
export class OfficeExposure {
  @PrimaryColumn('int')
  exposureType: number;

  @PrimaryColumn('int')
  modeType: number;

  @ManyToOne(
    () => OfficeExposureType,
    (officeexposuretype) => officeexposuretype.OfficeExposures,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'exposureType' })
  OfficeExposureType: OfficeExposureType;

  @ManyToOne(
    () => OfficeModeType,
    (officemodetype) => officemodetype.OfficeExposures,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'modeType' })
  OfficeModeType: OfficeModeType;
}
