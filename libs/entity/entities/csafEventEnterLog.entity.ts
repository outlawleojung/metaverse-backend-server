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

@Index('eventId', ['eventId'], {})
@Index('memberId', ['memberId'], { unique: true })
@Entity('csaf_event_enter_log')
export class CSAFEventEnterLog {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('int', { name: 'eventId' })
  eventId: number;

  @Column('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.CSAFEventEnterLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => CSAFEventInfo, (info) => info.CSAFEventEnterLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'eventId', referencedColumnName: 'id' }])
  CSAFEventInfo: CSAFEventInfo;
}
