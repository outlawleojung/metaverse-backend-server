import { Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('discipline_type')
export class DisciplineType extends BaseTypeEntity {}
