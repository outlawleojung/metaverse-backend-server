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
import { MoneyType } from './moneyType.entity';

@Index('moneyType', ['moneyType'], {})
@Entity('member_money')
export class MemberMoney {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int')
  moneyType: number;

  @Column('int')
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberMoney, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(() => MoneyType, (type) => type.MemberMoney, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'moneyType' })
  MoneyType: MoneyType;
}
