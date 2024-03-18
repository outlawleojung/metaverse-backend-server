import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';

@Index('reservationId', ['reservationId'], {})
@Index('memberId', ['memberId'], {})
@Entity('member_office_reservation_waiting_info')
export class MemberOfficeReservationWaitingInfo {
  @PrimaryColumn('int', { name: 'reservationId' })
  reservationId: number;

  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberOfficeReservationWaitingInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => MemberOfficeReservationInfo, (info) => info.MemberOfficeReservationWaitingInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'reservationId', referencedColumnName: 'id' }])
  MemberOfficeReservationInfo: MemberOfficeReservationInfo;
}
