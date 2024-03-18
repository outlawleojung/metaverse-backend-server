import { Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('dynamic_link_type')
export class DynamicLinkType extends BaseTypeEntity {}
