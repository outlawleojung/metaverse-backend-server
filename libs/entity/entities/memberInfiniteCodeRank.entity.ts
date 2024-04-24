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
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('memberId', ['memberId'], {})
@Entity('member_infinite_code_rank')
export class MemberInfiniteCodeRank extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('uuid')
  memberId: string;

  @Column('float', { nullable: true, precision: 12 })
  userScore: number | null;

  @ManyToOne(() => Member, (member) => member.MemberInfiniteCodeRanks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;
}
