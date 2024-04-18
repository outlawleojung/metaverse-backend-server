import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';
import { MemberAdContents } from '../entities/memberAdContents.entity';

export class MemberAdContentsRepository extends BaseRepository<MemberAdContents> {
  constructor(
    @InjectRepository(MemberAdContents)
    private memberAdContentsRepository: Repository<MemberAdContents>,
  ) {
    super(memberAdContentsRepository, MemberAdContents);
  }

  async findByMemberIdAndContentsId(
    memberId: string,
    contentsId: number,
    queryRunner?: QueryRunner,
  ): Promise<MemberAdContents> {
    return await this.getRepository(queryRunner).findOne({
      where: {
        memberId,
        contentsId,
      },
    });
  }

  async create(data: Partial<MemberAdContents>, queryRunner: QueryRunner) {
    const memberAdContents =
      await this.getRepository(queryRunner).findOneBy(data);

    if (memberAdContents) {
      throw new Error('Already Member Ad Contens');
    }

    await this.getRepository(queryRunner).save(data);
  }
}
