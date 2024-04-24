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
@Entity('office_show_room_info')
export class OfficeShowRoomInfo {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  roomId: number;

  @Column('varchar', { length: 64 })
  roomName: string;

  @Column('varchar', { length: 64 })
  roomDesc: string;

  @Column('varchar', { length: 64 })
  thumbnail: string;

  @JoinColumn({ name: 'modeType' })
  OfficeModeType: OfficeModeType;

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficeShowRoomInfoDescs,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'roomDesc' })
  LocalizationDesc: Localization;

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficeShowRoomInfoNames,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'roomName' })
  LocalizationName: Localization;
}
