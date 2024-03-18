import { CommerceZoneItem } from './commerceZoneItem.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('avatar_parts_color_type')
export class AvatarPartsColorType {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 20 })
  name: string;

  @OneToMany(() => CommerceZoneItem, (item) => item.AvatarPartsColorType)
  CommerceZoneItems: CommerceZoneItem[];
}
