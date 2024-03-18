import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OfficeExposureType } from './officeExposureType.entity';
import { OfficeModeType } from './officeModeType.entity';

@Index('modeType', ['modeType'], {})
@Entity('office_exposure')
export class OfficeExposure {
  @PrimaryColumn('int', { name: 'exposureType' })
  exposureType: number;

  @PrimaryColumn('int', { name: 'modeType' })
  modeType: number;

  @ManyToOne(() => OfficeExposureType, (officeexposuretype) => officeexposuretype.OfficeExposures, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'exposureType', referencedColumnName: 'type' }])
  OfficeExposureType: OfficeExposureType;

  @ManyToOne(() => OfficeModeType, (officemodetype) => officemodetype.OfficeExposures, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'modeType', referencedColumnName: 'type' }])
  OfficeModeType: OfficeModeType;
}
