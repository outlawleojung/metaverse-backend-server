import { Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('departmenttype')
export class DepartmentType extends BaseTypeEntity {}
