import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Item } from './item.entity';

@Index('itemId', ['itemId'], {})
@Entity('item_material')
export class ItemMaterial {
  @PrimaryColumn('int', { name: 'itemId' })
  itemId: number;

  @PrimaryColumn('int', { name: 'num' })
  num: number;

  @Column('varchar', { name: 'material', length: 64 })
  material: string;

  @ManyToOne(() => Item, (item) => item.ItemMaterials, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemId', referencedColumnName: 'id' }])
  Item: Item;
}
