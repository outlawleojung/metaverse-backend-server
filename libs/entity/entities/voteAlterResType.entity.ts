import { Entity, OneToMany } from 'typeorm';
import { VoteAlterResponse } from './voteAlterResponse.entity';
import { VoteInfo } from './voteInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('vote_alter_res_type')
export class VoteAlterResType extends BaseTypeEntity {
  @OneToMany(
    () => VoteAlterResponse,
    (votealterresponse) => votealterresponse.VoteAlterResType,
  )
  VoteAlterResponses: VoteAlterResponse[];

  @OneToMany(() => VoteInfo, (voteinfo) => voteinfo.VoteAlterResType)
  VoteInfos: VoteInfo[];
}
