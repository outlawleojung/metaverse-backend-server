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

@Index('blockMemberId', ['blockMemberId'], {})
@Entity('member_block')
export class MemberBlock {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('uuid')
  blockMemberId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberBlocks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;

  @ManyToOne(() => Member, (member) => member.MemberBlocks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'blockMemberId' }])
  MemberBlock: Member;
}
