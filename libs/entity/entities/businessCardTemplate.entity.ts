import { MoneyType } from './moneyType.entity';
import { MemberDefaultCardInfo } from '@libs/entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { MemberBusinessCardInfo } from './memberBusinessCardInfo.entity';

@Index('purchaseType', ['purchaseType'], {})
@Entity('business_card_template')
export class BusinessCardTemplate {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  purchaseType: number;

  @Column('int')
  price: number;

  @Column('int')
  nameField: number;

  @Column('int')
  phoneField: number;

  @Column('int')
  emailField: number;

  @Column('int')
  faxField: number;

  @Column('int')
  addrField: number;

  @Column('int')
  jobField: number;

  @Column('int')
  positionField: number;

  @Column('int')
  introField: number;

  @Column('varchar', { length: 64 })
  thumbnailName: string;

  @ManyToOne(() => MoneyType, (type) => type.BusinessCardTemplates, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'purchaseType' })
  PurchaseType: MoneyType;

  @OneToMany(
    () => MemberBusinessCardInfo,
    (memberbusinesscardinfo) => memberbusinesscardinfo.BusinessCardTemplate,
  )
  MemberBusinessCardInfos: MemberBusinessCardInfo[];

  @OneToMany(
    () => MemberDefaultCardInfo,
    (memberdefaultcardinfo) => memberdefaultcardinfo.BusinessCardTemplate,
  )
  MemberDefaultCardInfos: MemberBusinessCardInfo[];
}
