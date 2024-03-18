import { Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('object_interaction_type')
export class ObjectInteractionType extends BaseTypeEntity {}
