import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Index('itemId', ['itemId'], {})
@Entity('item_material')
export class ItemMaterial {
  @PrimaryColumn('int')
  itemId: number;

  @PrimaryColumn('int')
  num: number;

  @Column('varchar', { length: 64 })
  material: string;

  @ManyToOne(() => Item, (item) => item.ItemMaterials, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;
}
