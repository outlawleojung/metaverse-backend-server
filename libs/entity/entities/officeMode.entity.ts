import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OfficeModeType } from './officeModeType.entity';
import { Localization } from './localization.entity';

@Index('roomName', ['roomName'], {})
@Index('roomDesc', ['roomDesc'], {})
@Index('modeDesc', ['modeDesc'], {})
@Entity('office_mode')
export class OfficeMode {
  @PrimaryColumn('int', { name: 'modeType' })
  modeType: number;

  @Column('varchar', { name: 'icon', length: 64 })
  icon: string;

  @Column('varchar', { name: 'modeDesc', length: 64 })
  modeDesc: string;

  @Column('int', { name: 'privateYn' })
  privateYn: number;

  @Column('int', { name: 'passwordYn' })
  passwordYn: number;

  @Column('varchar', { name: 'roomName', length: 64 })
  roomName: string;

  @Column('varchar', { name: 'roomDesc', length: 64 })
  roomDesc: string;

  @Column('int', { name: 'startMin' })
  startMin: number;

  @Column('int', { name: 'minGap' })
  minGap: number;

  @Column('int', { name: 'timeCount' })
  timeCount: number;

  @ManyToOne(() => OfficeModeType, (officemodetype) => officemodetype.OfficeModes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'modeType', referencedColumnName: 'type' }])
  OfficeModeType: OfficeModeType;

  @ManyToOne(() => Localization, (localization) => localization.OfficeModeRoomName, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'roomName', referencedColumnName: 'id' }])
  LocalizationRoomName: Localization;

  @ManyToOne(() => Localization, (localization) => localization.OfficeModeRoomDesc, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'roomDesc', referencedColumnName: 'id' }])
  LocalizationRoomDesc: Localization;

  @ManyToOne(() => Localization, (localization) => localization.OfficeModeDesc, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'modeDesc', referencedColumnName: 'id' }])
  LocalizationModeDesc: Localization;
}
