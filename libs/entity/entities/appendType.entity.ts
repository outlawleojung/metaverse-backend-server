import { Entity, OneToMany } from 'typeorm';
import { PostboxAppend } from './postboxAppend.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('append_type')
export class AppendType extends BaseTypeEntity {
  @OneToMany(
    () => PostboxAppend,
    (memberPostBoxAppend) => memberPostBoxAppend.AppendType,
  )
  PostboxAppends: PostboxAppend[];
}
