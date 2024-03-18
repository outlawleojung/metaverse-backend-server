import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Item } from './item.entity';
import { LayerType } from './layerType.entity';

@Index('layerType', ['layerType'], {})
@Entity('interior_install_info')
export class InteriorInstallInfo {
  @PrimaryColumn('int', { name: 'itemId' })
  itemId: number;

  @Column('varchar', { name: 'prefab', length: 64 })
  prefab: string;

  @Column('int', { name: 'layerType' })
  layerType: number;

  @Column('int', { name: 'xSize' })
  xSize: number;

  @Column('int', { name: 'ySize' })
  ySize: number;

  @Column('int', { name: 'removable' })
  removable: number;

  @OneToOne(() => Item, (item) => item.InteriorInstallInfo, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemId', referencedColumnName: 'id' }])
  Item: Item;

  @ManyToOne(() => LayerType, (layertype) => layertype.InteriorInstallInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'layerType', referencedColumnName: 'type' }])
  LayerType: LayerType;
}
