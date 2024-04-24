import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { AvatarPartsGroupType } from './avatarPartsGroupType.entity';
import { AvatarPartsColorType } from './avatarPartsColorType.entity';
import { AvatarPartsSizeType } from './avatarPartsSizeType.entity';

@Index('groupType', ['groupType'], {})
@Index('colorType', ['colorType'], {})
@Index('sizeType', ['sizeType'], {})
@Entity('commerce_zone_item')
export class CommerceZoneItem {
  @PrimaryColumn('int')
  itemId: number;

  @Column('int')
  arwPrice: number;

  @Column('int')
  krwPrice: number;

  @Column('int')
  groupType: number;

  @Column('int')
  colorType: number;

  @Column('int')
  sizeType: number;

  @ManyToOne(
    () => AvatarPartsGroupType,
    (grouptype) => grouptype.CommerceZoneItems,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'groupType' })
  AvatarPartsGroupType: AvatarPartsGroupType;

  @ManyToOne(
    () => AvatarPartsColorType,
    (colortype) => colortype.CommerceZoneItems,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'colorType' })
  AvatarPartsColorType: AvatarPartsColorType;

  @ManyToOne(
    () => AvatarPartsSizeType,
    (sizetype) => sizetype.CommerceZoneItems,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'sizeType' })
  AvatarPartsSizeType: AvatarPartsSizeType;
}
