import { MemberBusinessCardInfo } from '@libs/entity';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';

export class MemberBusinessCardInfoRepository extends BaseRepository<MemberBusinessCardInfo> {
  constructor(
    @InjectRepository(MemberBusinessCardInfo)
    private memberBusinessCardInfoRepository: Repository<MemberBusinessCardInfo>,
  ) {
    super(memberBusinessCardInfoRepository, MemberBusinessCardInfo);
  }

  async findAllByMemberId(
    memberId: string,
    queryRunner?: QueryRunner,
  ): Promise<MemberBusinessCardInfo | null> {
    return await this.getRepository(queryRunner).findOne({
      select: {
        templateId: true,
        num: true,
        name: true,
        phone: true,
        email: true,
        addr: true,
        fax: true,
        job: true,
        position: true,
        intro: true,
        thumbnail: true,
      },
      where: {
        memberId,
      },
    });
  }

  async findOneByKey(memberId: string, templateId: number, num: number) {
    return await this.memberBusinessCardInfoRepository.findOne({
      where: {
        memberId,
        templateId,
        num,
      },
    });
  }

  async create(data: MemberBusinessCardInfo, queryRunner: QueryRunner) {
    await this.getRepository(queryRunner).save(data);
  }

  async update(data: MemberBusinessCardInfo, queryRunner: QueryRunner) {
    const { memberId, templateId, num, ...updateData } = data;

    const mb = await this.getRepository(queryRunner).findOne({
      where: {
        memberId,
        templateId,
        num,
      },
    });

    if (!mb) {
      throw new Error('MemberBusinessCardInfo not found');
    }

    Object.assign(mb, updateData);

    return await this.getRepository(queryRunner).save(mb);
  }

  async delete(data: MemberBusinessCardInfo, queryRunner: QueryRunner) {
    await this.getRepository(queryRunner).delete(data);
  }
}
