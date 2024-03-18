import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { OfficePermissionType } from './officePermissionType.entity';
import { OfficeSpawnType } from './officeSpawnType.entity';

@Index('spawnType', ['spawnType'], {})
@Entity('office_default_option')
export class OfficeDefaultOption {
  @PrimaryColumn('int', { name: 'permissionType' })
  permissionType: number;

  @Column('int', { name: 'charControl' })
  charControl: number;

  @Column('int', { name: 'camControl' })
  camControl: number;

  @Column('int', { name: 'actionEmotion' })
  actionEmotion: number;

  @Column('int', { name: 'chat' })
  chat: number;

  @Column('int', { name: 'voiceChat' })
  voiceChat: number;

  @Column('int', { name: 'videoChat' })
  videoChat: number;

  @Column('int', { name: 'web' })
  web: number;

  @Column('int', { name: 'webShare' })
  webShare: number;

  @Column('int', { name: 'videoPlayer' })
  videoPlayer: number;

  @Column('int', { name: 'videoPlayerShare' })
  videoPlayerShare: number;

  @Column('int', { name: 'spawnType' })
  spawnType: number;

  @Column('int', { name: 'movable' })
  movable: number;

  @Column('int', { name: 'selectSeat' })
  selectSeat: number;

  @OneToOne(() => OfficePermissionType, (officepermissiontype) => officepermissiontype.OfficeDefaultOption, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'permissionType', referencedColumnName: 'type' }])
  OfficePermissionType: OfficePermissionType;

  @ManyToOne(() => OfficeSpawnType, (officespawntype) => officespawntype.OfficeDefaultOptions, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'spawnType', referencedColumnName: 'type' }])
  OfficeSpawnType: OfficeSpawnType;
}
