import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('roomCode', ['roomCode'], {})
@Index('memberId', ['memberId'], {})
@Entity('member_office_visit_log')
export class MemberOfficeVisitLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'roomCode', length: 20 })
  roomCode: string;

  @Column('uuid')
  memberId: string;

  @CreateDateColumn()
  createdAt: Date;
}
