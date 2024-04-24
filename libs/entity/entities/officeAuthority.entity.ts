import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OfficeModeType } from './officeModeType.entity';
import { OfficePermissionType } from './officePermissionType.entity';

@Index('permissionType', ['permissionType'], {})
@Entity('office_authority')
export class OfficeAuthority {
  @PrimaryColumn('int')
  modeType: number;

  @PrimaryColumn('int')
  permissionType: number;

  @Column('int')
  chatLock: number;

  @Column('int')
  voiceLock: number;

  @Column('int')
  videoChatLock: number;

  @Column('int')
  webSharePermission: number;

  @Column('int')
  kick: number;

  @Column('int')
  selectHost: number;

  @Column('int')
  selectSubHost: number;

  @Column('int')
  selectGuest: number;

  @Column('int')
  selectAnnouncer: number;

  @Column('int')
  selectListener: number;

  @Column('int')
  selectObserver: number;

  @Column('int')
  changeRoomInfo: number;

  @Column('int')
  closeRoom: number;

  @ManyToOne(
    () => OfficeModeType,
    (officemodetype) => officemodetype.OfficeAuthorities,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'modeType' })
  OfficeModeType: OfficeModeType;

  @ManyToOne(
    () => OfficePermissionType,
    (officepermissiontype) => officepermissiontype.OfficeAuthorities,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'permissionType' })
  OfficePermissionType: OfficePermissionType;
}
