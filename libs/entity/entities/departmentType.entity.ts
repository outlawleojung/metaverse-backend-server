import { Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('department_type')
export class DepartmentType extends BaseTypeEntity {}
