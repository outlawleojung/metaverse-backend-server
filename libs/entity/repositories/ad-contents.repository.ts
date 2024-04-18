import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';
import { AdContents } from '../entities/adContents.entity';

export class AdContentsRepository extends BaseRepository<AdContents> {
  constructor(
    @InjectRepository(AdContents)
    private adContentsRepository: Repository<AdContents>,
  ) {
    super(adContentsRepository, AdContents);
  }

  async findById(id: number, queryRunner?: QueryRunner): Promise<AdContents> {
    return await this.getRepository(queryRunner).findOne({
      where: {
        id,
      },
    });
  }
}
