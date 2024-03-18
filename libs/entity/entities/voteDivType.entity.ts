import { Entity, OneToMany } from 'typeorm';
import { VoteInfo } from './voteInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('vote_div_type')
export class VoteDivType extends BaseTypeEntity {
  @OneToMany(() => VoteInfo, (voteinfo) => voteinfo.VoteDivType)
  VoteInfos: VoteInfo[];
}
