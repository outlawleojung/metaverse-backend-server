import { CommerceZoneMannequin } from './commerceZoneMannequin.entity';
import { AvatarPreset } from './avatarPreset.entity';
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
import { InteriorInstallInfo } from './interiorInstallInfo.entity';
import { ItemType } from './itemType.entity';
import { CategoryType } from './categoryType.entity';
import { PackageType } from './packageType.entity';
import { Localization } from './localization.entity';
import { MoneyType } from './moneyType.entity';
import { GradeType } from './gradeType.entity';
import { MemberItemInven } from './memberItemInven.entity';
import { StartInventory } from './startInventory.entity';
import { StartMyRoom } from './startMyRoom.entity';
import { AvatarResetInfo } from './avatarResetInfo.entity';
import { MemberAvatarPartsItemInven } from './memberAvatarPartsItemInven.entity';
import { NpcCostume } from './npcCostume.entity';
import { MemberFurnitureItemInven } from './memberFurnitureItemInven.entity';
import { BuySellType } from './buySellType.entity';
import { KtmfSpecialItem } from './ktmfSpecialItem.entiry';
import { KtmfNftToken } from './ktmfNftToken.entiry';
import { ItemMaterial } from './itemMaterial.entity';
import { ItemUseEffect } from './itemUseEffect.entity';

@Index('unique_id_item_type', ['id', 'itemType'], { unique: true })
@Index('itemType', ['itemType'], {})
@Index('categoryType', ['categoryType'], {})
@Index('packageType', ['packageType'], {})
@Index('name', ['name'], {})
@Index('description', ['description'], {})
@Index('purchaseType', ['purchaseType'], {})
@Index('saleType', ['saleType'], {})
@Index('gradeType', ['gradeType'], {})
@Index('buySellType', ['buySellType'], {})
@Entity('item')
export class Item {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  itemType: number;

  @Column('int')
  categoryType: number;

  @Column('int')
  packageType: number;

  @Column('varchar', { length: 64 })
  name: string;

  @Column('varchar', { length: 64 })
  description: string;

  @Column('varchar', { length: 64 })
  prefab: string;

  @Column('varchar', { length: 64 })
  thumbnail: string;

  @Column('int')
  isNesting: number;

  @Column('int')
  capacity: number;

  @Column('int')
  purchaseType: number;

  @Column('int')
  purchasePrice: number;

  @Column('int')
  saleType: number;

  @Column('int')
  salePrice: number;

  @Column('int')
  gradeType: number;

  @Column('int')
  buySellType: number;

  @OneToOne(
    () => InteriorInstallInfo,
    (interiorinstallinfo) => interiorinstallinfo.Item,
  )
  InteriorInstallInfo: InteriorInstallInfo;

  @ManyToOne(() => ItemType, (itemtype) => itemtype.Items, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemType' })
  ItemType: ItemType;

  @ManyToOne(() => CategoryType, (categorytype) => categorytype.Items, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryType' })
  CategoryType: CategoryType;

  @ManyToOne(() => PackageType, (packagetype) => packagetype.Items, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'packageType' })
  PackageType: PackageType;

  @ManyToOne(
    () => Localization,
    (localization) => localization.LocalizationItemName,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'name' })
  LocalizationName: Localization;

  @ManyToOne(
    () => Localization,
    (localization) => localization.LocalizationItemDesc,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'description' })
  LocalizationDesc: Localization;

  @ManyToOne(() => MoneyType, (type) => type.ItemPurchases, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'purchaseType' })
  PurchaseType: MoneyType;

  @ManyToOne(() => MoneyType, (type) => type.ItemSales, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'saleType' })
  SaleType: MoneyType;

  @ManyToOne(() => GradeType, (gradetype) => gradetype.Items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'gradeType' })
  GradeType: GradeType;

  @ManyToOne(() => BuySellType, (type) => type.Items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'buySellType' })
  BuySellType: BuySellType;

  @OneToMany(() => MemberFurnitureItemInven, (inven) => inven.Item)
  MemberFurnitureItemInvens: MemberFurnitureItemInven[];

  @OneToMany(
    () => MemberAvatarPartsItemInven,
    (memberavatarpartsiteminven) => memberavatarpartsiteminven.Item,
  )
  MemberAvatarPartsItemInvens: MemberAvatarPartsItemInven[];

  @OneToMany(() => MemberItemInven, (memberiteminven) => memberiteminven.Item)
  MemberItemInvens: MemberItemInven[];

  @OneToMany(() => StartInventory, (startinventory) => startinventory.Item)
  StartInventorys: StartInventory[];

  @OneToMany(() => StartMyRoom, (startmyroom) => startmyroom.Item)
  StartMyRooms: StartMyRoom[];

  @OneToMany(() => AvatarPreset, (avatarpreset) => avatarpreset.Item)
  AvatarPresets: AvatarPreset[];

  @OneToMany(() => CommerceZoneMannequin, (avatarpreset) => avatarpreset.Item)
  CommerceZoneMannequins: CommerceZoneMannequin[];

  @OneToMany(() => AvatarResetInfo, (avatarresetinfo) => avatarresetinfo.Item)
  AvatarResetInfos: AvatarResetInfo[];

  @OneToMany(() => NpcCostume, (npccostume) => npccostume.Item)
  NpcCostumes: NpcCostume[];

  @OneToMany(() => KtmfNftToken, (param) => param.Item)
  KtmfNftTokens: KtmfNftToken[];

  @OneToMany(() => KtmfSpecialItem, (param) => param.Item)
  KtmfSpecialItems: KtmfSpecialItem[];

  @OneToMany(() => ItemMaterial, (param) => param.Item)
  ItemMaterials: ItemMaterial[];

  @OneToMany(() => ItemUseEffect, (param) => param.Item)
  ItemUseEffects: ItemUseEffect[];
}
