import {
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
  @PrimaryColumn('int')
  reservationId: number;

  @PrimaryColumn('uuid')
  memberId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => Member,
    (member) => member.MemberOfficeReservationWaitingInfos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(
    () => MemberOfficeReservationInfo,
    (info) => info.MemberOfficeReservationWaitingInfos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'reservationId' })
  MemberOfficeReservationInfo: MemberOfficeReservationInfo;
}
