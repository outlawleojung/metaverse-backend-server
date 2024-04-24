import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { VoteAlterResType } from './voteAlterResType.entity';

@Index('alterResType', ['alterResType'], {})
@Entity('vote_alter_response')
export class VoteAlterResponse {
  @PrimaryColumn('int')
  id: number;

  @PrimaryColumn('int')
  alterResType: number;

  @Column('varchar', { length: 64 })
  name: string;

  @ManyToOne(
    () => VoteAlterResType,
    (votealterrestype) => votealterrestype.VoteAlterResponses,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'alterResType' })
  VoteAlterResType: VoteAlterResType;
}
