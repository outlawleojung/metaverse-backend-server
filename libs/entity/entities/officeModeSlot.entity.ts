import { OfficePermissionType } from './officePermissionType.entity';
import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OfficeModeType } from './officeModeType.entity';

@Index('permissionType', ['permissionType'], {})
@Entity('office_mode_slot')
export class OfficeModeSlot {
  @PrimaryColumn('int')
  modeType: number;

  @PrimaryColumn('int')
  permissionType: number;

  @ManyToOne(
    () => OfficeModeType,
    (officemodetype) => officemodetype.OfficeModeSlots,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'modeType' })
  OfficeModeType: OfficeModeType;

  @ManyToOne(
    () => OfficePermissionType,
    (officepermissiontype) => officepermissiontype.OfficeModeSlots,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'permissionType' })
  OfficePermissionType: OfficePermissionType;
}
