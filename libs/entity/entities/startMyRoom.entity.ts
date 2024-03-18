import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';
import { LayerType } from './layerType.entity';

@Index('itemId', ['itemId'], {})
@Index('layerType', ['layerType'], {})
@Entity('start_my_room')
export class StartMyRoom {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'itemId' })
  itemId: number;

  @Column('int', { name: 'layerType' })
  layerType: number;

  @Column('int', { name: 'x' })
  x: number;

  @Column('int', { name: 'y' })
  y: number;

  @Column('int', { name: 'rotation' })
  rotation: number;

  @ManyToOne(() => Item, (item) => item.StartMyRooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemId', referencedColumnName: 'id' }])
  Item: Item;

  @ManyToOne(() => LayerType, (layertype) => layertype.StartMyRooms, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'layerType', referencedColumnName: 'type' }])
  LayerType: LayerType;
}
