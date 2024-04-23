import { Entity, OneToMany } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';
import { Admin } from './admin.entity';

@Entity('role_type')
export class RoleType extends BaseTypeEntity {
  @OneToMany(() => Admin, (ammin) => ammin.RoleType)
  Admins: Admin[];
}
