import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { MoneyType } from './moneyType.entity';
import { MemberAdContents } from './memberAdContents.entity';

@Index('moneyType', ['moneyType'], {})
@Entity('ad_contents')
export class AdContents {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  moneyType: number;

  @Column('int')
  reward: number;

  @ManyToOne(() => MoneyType, (type) => type.AdContents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'moneyType' })
  MoneyType: MoneyType;

  @OneToMany(() => MemberAdContents, (money) => money.AdContents)
  MemberAdContents: MemberAdContents[];
}
