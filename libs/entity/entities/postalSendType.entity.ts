import { Entity, OneToMany } from 'typeorm';
import { Postbox } from './postbox.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('postal_send_type')
export class PostalSendType extends BaseTypeEntity {
  @OneToMany(() => Postbox, (postBox) => postBox.PostalSendType)
  Postboxes: Postbox[];
}
