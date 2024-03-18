import { Entity, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('package_type')
export class PackageType extends BaseTypeEntity {
  @OneToMany(() => Item, (item) => item.PackageType)
  Items: Item[];
}
