import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('roomCode', ['roomCode'], {})
@Index('memberId', ['memberId'], {})
@Entity('member_office_visit_log')
export class MemberOfficeVisitLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'roomCode', length: 20 })
  roomCode: string;

  @Column('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @CreateDateColumn()
  createdAt: Date;
}
