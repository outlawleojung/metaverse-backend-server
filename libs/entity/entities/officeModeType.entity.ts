import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { OfficeAuthority } from './officeAuthority.entity';
import { OfficeMode } from './officeMode.entity';
import { OfficePermissionType } from './officePermissionType.entity';
import { OfficeSpaceInfo } from './officeSpaceInfo.entity';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';
import { OfficeModeSlot } from './officeModeSlot.entity';
import { OfficeExposure } from './officeExposure.entity';
import { Localization } from './localization.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('office_mode_type')
export class OfficeModeType extends BaseTypeEntity {
  @ManyToOne(() => Localization, (localization) => localization.OfficeModeTypes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'id' }])
  LocalizationModeType: Localization;

  @OneToMany(() => OfficeAuthority, (officeauthority) => officeauthority.OfficeModeType)
  OfficeAuthorities: OfficeAuthority[];

  @OneToMany(() => OfficeMode, (officemode) => officemode.OfficeModeType)
  OfficeModes: OfficeMode[];

  @OneToMany(() => OfficeModeSlot, (officemodeslot) => officemodeslot.OfficeModeType)
  OfficeModeSlots: OfficeModeSlot[];

  @ManyToMany(() => OfficePermissionType, (officepermissiontype) => officepermissiontype.OfficeModeTypes)
  @JoinTable({
    name: 'officemodeslot',
    joinColumns: [{ name: 'modeType', referencedColumnName: 'type' }],
    inverseJoinColumns: [{ name: 'permissionType', referencedColumnName: 'type' }],
    schema: process.env.DB_DATABASE,
  })
  OfficePermissionTypes: OfficePermissionType[];

  @OneToMany(() => OfficeSpaceInfo, (officespaceinfo) => officespaceinfo.OfficeModeType)
  OfficeSpaceInfos: OfficeSpaceInfo[];

  @OneToMany(
    () => MemberOfficeReservationInfo,
    (memberOfficeReservationInfo) => memberOfficeReservationInfo.OfficeModeType,
  )
  MemberOfficeReservationInfos: MemberOfficeReservationInfo[];

  @OneToMany(() => OfficeExposure, (officeexposure) => officeexposure.OfficeModeType)
  OfficeExposures: OfficeExposure[];
}
