import { Column, Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('select_vote_state_type')
export class SelectVoteStateType extends BaseTypeEntity {}
