import { Entity, OneToMany } from 'typeorm';
import { Member } from './member.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('reg_path_type')
export class RegPathType extends BaseTypeEntity {
  @OneToMany(() => Member, (member) => member.RegPathType)
  Members: Member[];
}
