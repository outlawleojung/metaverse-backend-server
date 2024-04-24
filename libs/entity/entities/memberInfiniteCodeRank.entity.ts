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

@Index('memberId', ['memberId'], {})
@Entity('member_infinite_code_rank')
export class MemberInfiniteCodeRank {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('uuid')
  memberId: string;

  @Column('float', { name: 'userScore', nullable: true, precision: 12 })
  userScore: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberInfiniteCodeRanks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;
}
