import { Entity, OneToMany } from 'typeorm';
import { VoteInfo } from './voteInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('vote_res_type')
export class VoteResType extends BaseTypeEntity {
  @OneToMany(() => VoteInfo, (voteinfo) => voteinfo.VoteResType)
  VoteInfos: VoteInfo[];
}
