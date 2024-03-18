import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MannequinModelType } from './mannequinModelType.entity';
import { AvatarPartsType } from './avatarPartsType.entity';
import { Item } from './item.entity';

@Index('modelType', ['modelType'], {})
@Index('partsType', ['partsType'], {})
@Entity('commerce_zone_mannequin')
export class CommerceZoneMannequin {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'modelType' })
  modelType: number;

  @Column('int', { name: 'partsType' })
  partsType: number;

  @Column('int', { name: 'itemId' })
  itemId: number;

  @ManyToOne(() => MannequinModelType, (mannequinmodeltype) => mannequinmodeltype.CommerceZoneMannequins, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'modelType', referencedColumnName: 'type' }])
  MannequinModelType: MannequinModelType;

  @ManyToOne(() => AvatarPartsType, (avatarpartstype) => avatarpartstype.CommerceZoneMannequins, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'partsType', referencedColumnName: 'type' }])
  AvatarPartsType: AvatarPartsType;

  @ManyToOne(() => Item, (item) => item.CommerceZoneMannequins, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemId', referencedColumnName: 'id' }])
  Item: Item;
}
