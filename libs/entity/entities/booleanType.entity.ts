import { Entity, OneToMany } from 'typeorm';
import { VoteInfo } from './voteInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('boolean_type')
export class BooleanType extends BaseTypeEntity {
  @OneToMany(() => VoteInfo, (voteinfo) => voteinfo.isExposingResultBool)
  IsExposingResultVoteInfos: VoteInfo[];

  @OneToMany(() => VoteInfo, (voteinfo) => voteinfo.isEnabledEditBool)
  IsEnabledEditVoteInfos: VoteInfo[];
}
