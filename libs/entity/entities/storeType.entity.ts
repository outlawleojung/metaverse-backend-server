import { Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('store_type')
export class StoreType extends BaseTypeEntity {}
