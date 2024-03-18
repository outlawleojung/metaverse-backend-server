import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OfficeModeType } from './officeModeType.entity';
import { Localization } from './localization.entity';

@Index('roomName', ['roomName'], {})
@Index('roomDesc', ['roomDesc'], {})
@Entity('office_show_room_info')
export class OfficeShowRoomInfo {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'roomId' })
  roomId: number;

  @Column('varchar', { name: 'roomName', length: 64 })
  roomName: string;

  @Column('varchar', { name: 'roomDesc', length: 64 })
  roomDesc: string;

  @Column('varchar', { name: 'thumbnail', length: 64 })
  thumbnail: string;

  @JoinColumn([{ name: 'modeType', referencedColumnName: 'type' }])
  OfficeModeType: OfficeModeType;

  @ManyToOne(() => Localization, (localization) => localization.OfficeShowRoomInfoDescs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'roomDesc', referencedColumnName: 'id' }])
  LocalizationDesc: Localization;

  @ManyToOne(() => Localization, (localization) => localization.OfficeShowRoomInfoNames, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'roomName', referencedColumnName: 'id' }])
  LocalizationName: Localization;
}
