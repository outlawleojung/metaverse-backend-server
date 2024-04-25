import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Index('roomCode', ['roomCode'], {})
@Index('memberId', ['memberId'], {})
@Entity('member_office_visit_log')
export class MemberOfficeVisitLog {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 20 })
  roomCode: string;

  @Column('uuid')
  memberId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberOfficeVisitLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;
}
