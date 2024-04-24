import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { OfficePermissionType } from './officePermissionType.entity';
import { OfficeSpawnType } from './officeSpawnType.entity';

@Index('spawnType', ['spawnType'], {})
@Entity('office_default_option')
export class OfficeDefaultOption {
  @PrimaryColumn('int')
  permissionType: number;

  @Column('int')
  charControl: number;

  @Column('int')
  camControl: number;

  @Column('int')
  actionEmotion: number;

  @Column('int')
  chat: number;

  @Column('int')
  voiceChat: number;

  @Column('int')
  videoChat: number;

  @Column('int')
  web: number;

  @Column('int')
  webShare: number;

  @Column('int')
  videoPlayer: number;

  @Column('int')
  videoPlayerShare: number;

  @Column('int')
  spawnType: number;

  @Column('int')
  movable: number;

  @Column('int')
  selectSeat: number;

  @OneToOne(
    () => OfficePermissionType,
    (officepermissiontype) => officepermissiontype.OfficeDefaultOption,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'permissionType' })
  OfficePermissionType: OfficePermissionType;

  @ManyToOne(
    () => OfficeSpawnType,
    (officespawntype) => officespawntype.OfficeDefaultOptions,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'spawnType' })
  OfficeSpawnType: OfficeSpawnType;
}
