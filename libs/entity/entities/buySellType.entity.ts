import { Entity, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('buy_sell_type')
export class BuySellType extends BaseTypeEntity {
  @OneToMany(() => Item, (item) => item.BuySellType)
  Items: Item[];
}
