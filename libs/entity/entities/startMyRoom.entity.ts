import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { LayerType } from './layerType.entity';

@Index('itemId', ['itemId'], {})
@Index('layerType', ['layerType'], {})
@Entity('start_my_room')
export class StartMyRoom {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  itemId: number;

  @Column('int')
  layerType: number;

  @Column('int')
  x: number;

  @Column('int')
  y: number;

  @Column('int')
  rotation: number;

  @ManyToOne(() => Item, (item) => item.StartMyRooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;

  @ManyToOne(() => LayerType, (layertype) => layertype.StartMyRooms, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'layerType' })
  LayerType: LayerType;
}
