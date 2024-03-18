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
@Entity('block_member')
export class BlockMember {
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @PrimaryColumn('varchar', { name: 'blockMemberId', length: 100 })
  blockMemberId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.BlockMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => Member, (member) => member.BlockMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'blockMemberId', referencedColumnName: 'memberId' }])
  BlockMember: Member;
}
