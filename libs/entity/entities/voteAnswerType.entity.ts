import { Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('vote_answer_type')
export class Voteanswertype extends BaseTypeEntity {}
