import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';

@Index('dynamicLinkType', ['dynamicLinkType'], {})
@Entity('room_short_link')
export class RoomShortLink {
  @PrimaryColumn('int')
  roomCode: number;

  @Column('varchar', { length: 256 })
  mobileDynamicLink: string;

  @Column('varchar', { length: 256 })
  pcDynamicLink: string;

  @Column('int')
  dynamicLinkType: number;

  @ManyToOne(
    () => MemberOfficeReservationInfo,
    (info) => info.CSAFEventBoothInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'roomCode' })
  RoomCodeInfo: MemberOfficeReservationInfo;
}
