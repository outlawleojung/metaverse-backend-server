import { Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('vote_state_type')
export class VoteStateType extends BaseTypeEntity {}
