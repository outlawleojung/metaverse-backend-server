import { Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('role_type')
export class RoleType extends BaseTypeEntity {
  @OneToMany(() => User, (user) => user.RoleType)
  Admins: User[];
}
