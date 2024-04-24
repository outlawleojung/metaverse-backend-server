import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MannequinModelType } from './mannequinModelType.entity';
import { AvatarPartsType } from './avatarPartsType.entity';
import { Item } from './item.entity';

@Index('modelType', ['modelType'], {})
@Index('partsType', ['partsType'], {})
@Entity('commerce_zone_mannequin')
export class CommerceZoneMannequin {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  modelType: number;

  @Column('int')
  partsType: number;

  @Column('int')
  itemId: number;

  @ManyToOne(
    () => MannequinModelType,
    (mannequinmodeltype) => mannequinmodeltype.CommerceZoneMannequins,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'modelType' })
  MannequinModelType: MannequinModelType;

  @ManyToOne(
    () => AvatarPartsType,
    (avatarpartstype) => avatarpartstype.CommerceZoneMannequins,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'partsType' })
  AvatarPartsType: AvatarPartsType;

  @ManyToOne(() => Item, (item) => item.CommerceZoneMannequins, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;
}
