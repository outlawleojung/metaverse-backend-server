import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity('start_inventory')
export class StartInventory {
  @PrimaryColumn('int')
  itemId: number;

  @Column('int')
  count: number;

  @ManyToOne(() => Item, (item) => item.StartInventorys, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;
}
