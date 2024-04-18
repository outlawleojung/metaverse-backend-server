import { MemberDefaultCardInfo } from '@libs/entity';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';

export class MemberDefaultCardInfoRepository extends BaseRepository<MemberDefaultCardInfo> {
  constructor(
    @InjectRepository(MemberDefaultCardInfo)
    private memberdefaultsCardInfoRepository: Repository<MemberDefaultCardInfo>,
  ) {
    super(memberdefaultsCardInfoRepository, MemberDefaultCardInfo);
  }

  async findAllByMemberId(
    memberId: string,
    queryRunner?: QueryRunner,
  ): Promise<MemberDefaultCardInfo | null> {
    return await this.getRepository(queryRunner).findOne({
      select: {
        templateId: true,
        num: true,
      },
      where: {
        memberId,
      },
    });
  }

  async update(data: MemberDefaultCardInfo, queryRunner: QueryRunner) {
    const { memberId, ...updateData } = data;

    const mb = await this.getRepository(queryRunner).findOne({
      where: {
        memberId,
      },
    });

    if (!mb) {
      throw new Error('MemberDefaultCardInfo not found');
    }

    Object.assign(mb, updateData);

    return await this.getRepository(queryRunner).save(mb);
  }

  async delete(memberId: string, queryRunner?: QueryRunner) {
    await this.getRepository(queryRunner).delete({ memberId });
  }
}
