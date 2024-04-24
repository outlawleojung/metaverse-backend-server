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
import { MoneyType } from './moneyType.entity';

@Index('memberId', ['memberId'], {})
@Entity('member_nft_reward_log')
export class MemberNftRewardLog {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('uuid')
  memberId: string;

  @Column('varchar', { name: 'tokenId', length: 64 })
  tokenId: string;

  @Column('int', { name: 'moneyType' })
  moneyType: number;

  @Column('int', { name: 'rewardCount' })
  rewardCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberAccounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;

  @ManyToOne(() => MoneyType, (type) => type.MemberNftRewardLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'moneyType', referencedColumnName: 'type' }])
  MoneyType: MoneyType;
}
