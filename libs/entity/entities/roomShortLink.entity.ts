import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';

@Index('dynamicLinkType', ['dynamicLinkType'], {})
@Entity('room_short_link')
export class RoomShortLink {
  @PrimaryColumn('int', { name: 'roomCode' })
  roomCode: number;

  @ManyToOne(() => MemberOfficeReservationInfo, (info) => info.CSAFEventBoothInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'roomCode', referencedColumnName: 'roomCode' }])
  RoomCodeInfo: MemberOfficeReservationInfo;

  @Column('varchar', { name: 'mobileDynamicLink', length: 256 })
  mobileDynamicLink: string;

  @Column('varchar', { name: 'pcDynamicLink', length: 256 })
  pcDynamicLink: string;

  @Column('int', { name: 'dynamicLinkType' })
  dynamicLinkType: number;
}
