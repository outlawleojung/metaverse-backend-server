import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { VoteAlterResponse } from './voteAlterResponse.entity';
import { VoteInfo } from './voteInfo.entity';

@Entity('vote_alter_res_type')
export class VoteAlterResType {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 20 })
  name: string;

  @OneToMany(() => VoteAlterResponse, (votealterresponse) => votealterresponse.VoteAlterResType)
  VoteAlterResponses: VoteAlterResponse[];

  @OneToMany(() => VoteInfo, (voteinfo) => voteinfo.VoteAlterResType)
  VoteInfos: VoteInfo[];
}
