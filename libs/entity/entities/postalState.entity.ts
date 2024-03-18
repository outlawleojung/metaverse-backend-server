import { Entity, OneToMany } from 'typeorm';
import { Postbox } from './postbox.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('postal_state')
export class PostalState extends BaseTypeEntity {
  @OneToMany(() => Postbox, (memberPostBox) => memberPostBox.PostalState)
  Postboxes: Postbox[];
}
