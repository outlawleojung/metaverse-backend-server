import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OfficeModeType } from './officeModeType.entity';
import { Localization } from './localization.entity';

@Index('roomName', ['roomName'], {})
@Index('roomDesc', ['roomDesc'], {})
@Index('modeDesc', ['modeDesc'], {})
@Entity('office_mode')
export class OfficeMode {
  @PrimaryColumn('int')
  modeType: number;

  @Column('varchar', { length: 64 })
  icon: string;

  @Column('varchar', { length: 64 })
  modeDesc: string;

  @Column('int')
  privateYn: number;

  @Column('int')
  passwordYn: number;

  @Column('varchar', { length: 64 })
  roomName: string;

  @Column('varchar', { length: 64 })
  roomDesc: string;

  @Column('int')
  startMin: number;

  @Column('int')
  minGap: number;

  @Column('int')
  timeCount: number;

  @ManyToOne(
    () => OfficeModeType,
    (officemodetype) => officemodetype.OfficeModes,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'modeType' })
  OfficeModeType: OfficeModeType;

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficeModeRoomName,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'roomName' })
  LocalizationRoomName: Localization;

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficeModeRoomDesc,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'roomDesc' })
  LocalizationRoomDesc: Localization;

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficeModeDesc,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'modeDesc' })
  LocalizationModeDesc: Localization;
}
