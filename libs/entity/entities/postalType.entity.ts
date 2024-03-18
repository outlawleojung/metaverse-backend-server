import { Entity, OneToMany } from 'typeorm';
import { Postbox } from './postbox.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('postal_type')
export class PostalType extends BaseTypeEntity {
  @OneToMany(() => Postbox, (memberPostBox) => memberPostBox.PostalType)
  Postboxes: Postbox[];
}
