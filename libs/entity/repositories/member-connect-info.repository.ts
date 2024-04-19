import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';
import { MemberConnectInfo } from '../entities/memberConnectInfo.entity';

export class MemberConnectInfoRepository extends BaseRepository<MemberConnectInfo> {
  constructor(
    @InjectRepository(MemberConnectInfo)
    private memberConnectInfoRepository: Repository<MemberConnectInfo>,
  ) {
    super(memberConnectInfoRepository, MemberConnectInfo);
  }

  async findByMemberCode(
    memberCode: string,
    queryRunner?: QueryRunner,
  ): Promise<MemberConnectInfo> {
    return await this.getRepository(queryRunner).findOne({
      select: { roomId: true },
      where: {
        memberCode,
      },
    });
  }
}
