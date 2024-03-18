import { CommerceZoneMannequin } from './commerceZoneMannequin.entity';
import { AvatarPreset } from './avatarPreset.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
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

@Index('unique_id_item_type', ['id', 'itemType'], { unique: true })
@Index('itemType', ['itemType'], {})
@Index('categoryType', ['categoryType'], {})
@Index('packageType', ['packageType'], {})
@Index('name', ['name'], {})
@Index('description', ['description'], {})
@Index('purchaseType', ['purchaseType'], {})
@Index('saleType', ['saleType'], {})
@Index('gradeType', ['gradeType'], {})
@Index('gradeType', ['gradeType'], {})
@Entity('item')
export class Item {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'itemType' })
  itemType: number;

  @Column('int', { name: 'categoryType' })
  categoryType: number;

  @Column('int', { name: 'packageType' })
  packageType: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('varchar', { name: 'description', length: 64 })
  description: string;

  @Column('varchar', { name: 'prefab', length: 64 })
  prefab: string;

  @Column('varchar', { name: 'thumbnail', length: 64 })
  thumbnail: string;

  @Column('int', { name: 'isNesting' })
  isNesting: number;

  @Column('int', { name: 'capacity' })
  capacity: number;

  @Column('int', { name: 'purchaseType' })
  purchaseType: number;

  @Column('int', { name: 'purchasePrice' })
  purchasePrice: number;

  @Column('int', { name: 'saleType' })
  saleType: number;

  @Column('int', { name: 'salePrice' })
  salePrice: number;

  @Column('int', { name: 'gradeType' })
  gradeType: number;

  @Column('int', { name: 'buySellType' })
  buySellType: number;

  @OneToOne(() => InteriorInstallInfo, (interiorinstallinfo) => interiorinstallinfo.Item)
  InteriorInstallInfo: InteriorInstallInfo;

  @ManyToOne(() => ItemType, (itemtype) => itemtype.Items, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemType', referencedColumnName: 'type' }])
  ItemType: ItemType;

  @ManyToOne(() => CategoryType, (categorytype) => categorytype.Items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'categoryType', referencedColumnName: 'type' }])
  CategoryType: CategoryType;

  @ManyToOne(() => PackageType, (packagetype) => packagetype.Items, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'packageType', referencedColumnName: 'type' }])
  PackageType: PackageType;

  @ManyToOne(() => Localization, (localization) => localization.LocalizationItemName, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'id' }])
  LocalizationName: Localization;

  @ManyToOne(() => Localization, (localization) => localization.LocalizationItemDesc, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'description', referencedColumnName: 'id' }])
  LocalizationDesc: Localization;

  @ManyToOne(() => MoneyType, (type) => type.ItemPurchases, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'purchaseType', referencedColumnName: 'type' }])
  PurchaseType: MoneyType;

  @ManyToOne(() => MoneyType, (type) => type.ItemSales, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'saleType', referencedColumnName: 'type' }])
  SaleType: MoneyType;

  @ManyToOne(() => GradeType, (gradetype) => gradetype.Items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'gradeType', referencedColumnName: 'type' }])
  GradeType: GradeType;

  @ManyToOne(() => BuySellType, (type) => type.Items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'buySellType', referencedColumnName: 'type' }])
  BuySellType: BuySellType;

  @OneToMany(() => MemberFurnitureItemInven, (inven) => inven.Item)
  MemberFurnitureItemInvens: MemberFurnitureItemInven[];

  @OneToMany(() => MemberAvatarPartsItemInven, (memberavatarpartsiteminven) => memberavatarpartsiteminven.Item)
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
}
