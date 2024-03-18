import { Entity, OneToMany } from 'typeorm';
import { PostalMoneyProperty } from './postalMoneyProperty.entity';
import { PaymentProductManager } from './paymentProductManager.entity';
import { Item } from './item.entity';
import { BusinessCardTemplate } from './businessCardTemplate.entity';
import { MemberMoney } from './memberMoney.entity';
import { AdContents } from './adContents.entity';
import { MemberNftRewardLog } from './memberNftRewardLog.entity';
import { KtmfSpecialMoney } from './ktmfSpecialMoney.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('money_type')
export class MoneyType extends BaseTypeEntity {
  @OneToMany(() => PostalMoneyProperty, (property) => property.MoneyType)
  PostalMoneyProperties: PostalMoneyProperty[];

  @OneToMany(() => PaymentProductManager, (manager) => manager.MoneyType)
  PaymentProductManagers: PaymentProductManager[];

  @OneToMany(() => MemberMoney, (money) => money.MoneyType)
  MemberMoney: MemberMoney[];

  @OneToMany(() => BusinessCardTemplate, (temlate) => temlate.PurchaseType)
  BusinessCardTemplates: BusinessCardTemplate[];

  @OneToMany(() => Item, (item) => item.PurchaseType)
  ItemPurchases: Item[];

  @OneToMany(() => Item, (item) => item.SaleType)
  ItemSales: Item[];

  @OneToMany(() => AdContents, (ad) => ad.MoneyType)
  AdContents: AdContents[];

  @OneToMany(() => MemberNftRewardLog, (ad) => ad.MoneyType)
  MemberNftRewardLogs: MemberNftRewardLog[];

  @OneToMany(() => KtmfSpecialMoney, (ad) => ad.MoneyType)
  KtmfSpecialMoney: KtmfSpecialMoney[];
}
