import { Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('admin_type')
export class AdminType extends BaseTypeEntity {
  @OneToMany(() => User, (user) => user.AdminType)
  Admins: User[];
}
