import { Item } from './item.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { AvatarPartsType } from './avatarPartsType.entity';

@Index('itemId', ['itemId'], {})
@Entity('avatar_reset_info')
export class AvatarResetInfo {
  @PrimaryColumn('int')
  partsType: number;

  @Column('int')
  itemId: number;

  @ManyToOne(
    () => AvatarPartsType,
    (avatarpartstype) => avatarpartstype.AvatarResetInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'partsType' })
  AvatarPartsType: AvatarPartsType;

  @ManyToOne(() => Item, (item) => item.AvatarResetInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;
}
