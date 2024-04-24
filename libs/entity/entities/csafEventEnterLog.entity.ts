import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { CSAFEventInfo } from './csafEventInfo.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('eventId', ['eventId'], {})
@Index('memberId', ['memberId'], { unique: true })
@Entity('csaf_event_enter_log')
export class CSAFEventEnterLog extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  eventId: number;

  @Column('uuid')
  memberId: string;

  @ManyToOne(() => Member, (member) => member.CSAFEventEnterLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(() => CSAFEventInfo, (info) => info.CSAFEventEnterLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  CSAFEventInfo: CSAFEventInfo;
}
