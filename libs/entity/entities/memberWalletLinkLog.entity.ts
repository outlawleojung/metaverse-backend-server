import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModelEntity } from './baseModelEntity.entity';
import { Member } from './member.entity';

@Index('memberId', ['memberId'], {})
@Index('walletAddr', ['walletAddr'], {})
@Entity('member_wallet_link_log')
export class MemberWalletLinkLog extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('uuid')
  memberId: string;

  @Column('varchar', { length: 128 })
  walletAddr: string;

  @Column('int', { name: 'linkType' })
  linkType: number;

  @ManyToOne(() => Member, (member) => member.MemberWalletLinkLogs, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;
}
