import { Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('jumping_matching_game_type')
export class JumpingMatchingGameType extends BaseTypeEntity {}
