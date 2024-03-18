import { Entity, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('grade_type')
export class GradeType extends BaseTypeEntity {
  @OneToMany(() => Item, (item) => item.GradeType)
  Items: Item[];
}
