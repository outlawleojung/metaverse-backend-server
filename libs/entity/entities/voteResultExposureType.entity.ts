import { Entity, OneToMany } from 'typeorm';
import { VoteInfo } from './voteInfo.entity';
import { SelectVoteInfo } from './selectVoteInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('vote_result_exposure_type')
export class VoteResultExposureType extends BaseTypeEntity {
  @OneToMany(() => VoteInfo, (info) => info.VoteResultExposureType)
  VoteInfos: VoteInfo[];

  @OneToMany(() => SelectVoteInfo, (info) => info.VoteResultExposureType)
  SelectVoteInfos: SelectVoteInfo[];
}
