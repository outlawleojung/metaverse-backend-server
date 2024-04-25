import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { MoneyType } from './moneyType.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('memberId', ['memberId'], {})
@Index('moneyType', ['moneyType'], {})
@Entity('member_nft_reward_log')
export class MemberNftRewardLog extends BaseModelEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('uuid')
  memberId: string;

  @Column('varchar', { length: 64 })
  tokenId: string;

  @Column('int')
  moneyType: number;

  @Column('int')
  rewardCount: number;

  @ManyToOne(() => Member, (member) => member.MemberAccounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(() => MoneyType, (type) => type.MemberNftRewardLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'moneyType' })
  MoneyType: MoneyType;
}
