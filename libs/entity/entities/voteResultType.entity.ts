import { Entity, OneToMany } from 'typeorm';
import { SelectVoteInfo } from './selectVoteInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('vote_result_type')
export class VoteResultType extends BaseTypeEntity {
  @OneToMany(() => SelectVoteInfo, (info) => info.VoteResultType)
  SelectVoteInfos: SelectVoteInfo[];
}
