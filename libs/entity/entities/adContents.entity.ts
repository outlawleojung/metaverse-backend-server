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
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'moneyType' })
  moneyType: number;

  @Column('int', { name: 'reward' })
  reward: number;

  @ManyToOne(() => MoneyType, (type) => type.AdContents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'moneyType', referencedColumnName: 'type' }])
  MoneyType: MoneyType;

  @OneToMany(() => MemberAdContents, (money) => money.AdContents)
  MemberAdContents: MemberAdContents[];
}
