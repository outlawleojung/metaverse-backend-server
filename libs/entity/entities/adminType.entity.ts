import { Entity, OneToMany } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';
import { Admin } from './admin.entity';

@Entity('admin_type')
export class AdminType extends BaseTypeEntity {
  @OneToMany(() => Admin, (admin) => admin.AdminType)
  Admins: Admin[];
}
