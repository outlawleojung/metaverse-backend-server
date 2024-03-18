import { MoneyType } from './moneyType.entity';
import { MemberDefaultCardInfo } from '@libs/entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Localization } from './localization.entity';
import { MemberBusinessCardInfo } from './memberBusinessCardInfo.entity';

@Index('purchaseType', ['purchaseType'], {})
@Entity('business_card_template')
export class BusinessCardTemplate {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'purchaseType' })
  purchaseType: number;

  @Column('int', { name: 'price' })
  price: number;

  @Column('int', { name: 'nameField' })
  nameField: number;

  @Column('int', { name: 'phoneField' })
  phoneField: number;

  @Column('int', { name: 'emailField' })
  emailField: number;

  @Column('int', { name: 'faxField' })
  faxField: number;

  @Column('int', { name: 'addrField' })
  addrField: number;

  @Column('int', { name: 'jobField' })
  jobField: number;

  @Column('int', { name: 'positionField' })
  positionField: number;

  @Column('int', { name: 'introField' })
  introField: number;

  @Column('varchar', { name: 'thumbnailName', length: 64 })
  thumbnailName: string;

  @ManyToOne(() => MoneyType, (type) => type.BusinessCardTemplates, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'purchaseType', referencedColumnName: 'type' }])
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
