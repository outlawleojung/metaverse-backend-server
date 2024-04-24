import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('memberId', ['memberId'], {})
@Index('walletAddr', ['walletAddr'], {})
@Entity('member_wallet_link_log')
export class MemberWalletLinkLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('uuid')
  memberId: string;

  @Column('varchar', { name: 'walletAddr', length: 128 })
  walletAddr: string;

  @Column('int', { name: 'linkType' })
  linkType: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
