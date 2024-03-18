import { CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { CSAFEventInfo } from './csafEventInfo.entity';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';

@Index('eventId', ['eventId'], {})
@Index('boothId', ['boothId'], {})
@Entity('csaf_event_booth_info')
export class CSAFEventBoothInfo {
  @PrimaryColumn('int', { name: 'eventId' })
  eventId: number;

  @PrimaryColumn('int', { name: 'boothId' })
  boothId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CSAFEventInfo, (info) => info.CSAFEventBoothInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'eventId', referencedColumnName: 'id' }])
  CSAFEventInfo: CSAFEventInfo;

  @ManyToOne(() => MemberOfficeReservationInfo, (info) => info.CSAFEventBoothInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'boothId', referencedColumnName: 'id' }])
  MemberOfficeReservationInfo: MemberOfficeReservationInfo;
}
