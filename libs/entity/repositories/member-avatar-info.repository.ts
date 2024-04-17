import { MemberAvatarInfo } from '@libs/entity';
import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';

export class MemberAvatarInfoRepository extends BaseRepository<MemberAvatarInfo> {
  constructor(
    @InjectRepository(MemberAvatarInfo)
    private memberAvatarInfoRepository: Repository<MemberAvatarInfo>,
  ) {
    super(memberAvatarInfoRepository, MemberAvatarInfo);
  }

  async findByMemberIdAndPartsType(
    memberId: string,
    avatarPartsType: number,
  ): Promise<MemberAvatarInfo | null> {
    return await this.repository.findOne({
      where: {
        memberId,
        avatarPartsType,
      },
    });
  }

  async deleteByMemberIdAndParsType(
    memberId: string,
    avatarPartsType: number,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    return await this.getRepository(queryRunner).delete({
      memberId,
      avatarPartsType,
    });
  }

  async create(data: MemberAvatarInfo, queryRunner?: QueryRunner) {
    await this.getRepository(queryRunner).save(data);
  }
}
