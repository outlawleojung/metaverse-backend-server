import { Entity, OneToMany } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';
import { MemberRestriction } from './memberRestriction.entity';

@Entity('discipline_type')
export class DisciplineType extends BaseTypeEntity {
  @OneToMany(() => MemberRestriction, (param) => param.DisciplineType)
  MemberRestrictions: MemberRestriction[];
}
