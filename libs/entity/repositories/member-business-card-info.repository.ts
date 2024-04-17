import { MemberBusinessCardInfo } from '@libs/entity';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class MemberBusinessCardInfoRepository {
  constructor(
    @InjectRepository(MemberBusinessCardInfo)
    private repository: Repository<MemberBusinessCardInfo>,
  ) {}

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

  async create(data: MemberBusinessCardInfo, queryRunner: QueryRunner) {
    await queryRunner.manager.getRepository(MemberBusinessCardInfo).save(data);
  }

  async update(data: MemberBusinessCardInfo, queryRunner: QueryRunner) {
    await queryRunner.manager.getRepository(MemberBusinessCardInfo).save(data);
  }

  async delete(data: MemberBusinessCardInfo, queryRunner: QueryRunner) {
    await queryRunner.manager
      .getRepository(MemberBusinessCardInfo)
      .delete(data);
  }

  private getRepository(queryRunner?: QueryRunner) {
    return queryRunner
      ? queryRunner.manager.getRepository<MemberBusinessCardInfo>(
          MemberBusinessCardInfo,
        )
      : this.repository;
  }
}
