import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';
import { MemberLoginLog } from '../entities/memberLoginLog.entity';

export class MemberLoginLogRepository extends BaseRepository<MemberLoginLog> {
  constructor(
    @InjectRepository(MemberLoginLog)
    private memberLoginLogRepository: Repository<MemberLoginLog>,
  ) {
    super(memberLoginLogRepository, MemberLoginLog);
  }

  async create(data: Partial<MemberLoginLog>, queryRunner?: QueryRunner) {
    await this.getRepository(queryRunner).save(data);
  }
}
