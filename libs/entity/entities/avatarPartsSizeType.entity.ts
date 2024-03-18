import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CommerceZoneItem } from './commerceZoneItem.entity';

@Entity('avatar_parts_size_type')
export class AvatarPartsSizeType {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 20 })
  name: string;

  @OneToMany(() => CommerceZoneItem, (item) => item.AvatarPartsGroupType)
  CommerceZoneItems: CommerceZoneItem[];
}
