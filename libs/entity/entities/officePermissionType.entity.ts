import {
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { OfficeAuthority } from './officeAuthority.entity';
import { OfficeDefaultOption } from './officeDefaultOption.entity';
import { OfficeModeType } from './officeModeType.entity';
import { OfficeModeSlot } from './officeModeSlot.entity';
import { Localization } from './localization.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Index('name', ['name'], {})
@Entity('office_permission_type')
export class OfficePermissionType extends BaseTypeEntity {
  @OneToMany(
    () => OfficeAuthority,
    (officeauthority) => officeauthority.OfficePermissionType,
  )
  OfficeAuthorities: OfficeAuthority[];

  @OneToMany(
    () => OfficeModeSlot,
    (officeModeSlot) => officeModeSlot.OfficePermissionType,
  )
  OfficeModeSlots: OfficeModeSlot[];

  @OneToOne(
    () => OfficeDefaultOption,
    (officedefaultoption) => officedefaultoption.OfficePermissionType,
  )
  OfficeDefaultOption: OfficeDefaultOption;

  @ManyToMany(
    () => OfficeModeType,
    (officemodetype) => officemodetype.OfficePermissionTypes,
  )
  OfficeModeTypes: OfficeModeType[];

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficePermissionTypes,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'name' })
  LocalizationName: Localization;
}
