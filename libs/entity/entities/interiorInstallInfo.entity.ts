import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { LayerType } from './layerType.entity';

@Index('layerType', ['layerType'], {})
@Entity('interior_install_info')
export class InteriorInstallInfo {
  @PrimaryColumn('int')
  itemId: number;

  @Column('varchar', { length: 64 })
  prefab: string;

  @Column('int')
  layerType: number;

  @Column('int')
  xSize: number;

  @Column('int')
  ySize: number;

  @Column('int')
  removable: number;

  @OneToOne(() => Item, (item) => item.InteriorInstallInfo, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;

  @ManyToOne(() => LayerType, (layertype) => layertype.InteriorInstallInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'layerType' })
  LayerType: LayerType;
}
