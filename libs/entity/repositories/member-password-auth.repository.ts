import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberPasswordAuth } from '../entities/memberPasswordAuth.entity';
import { BaseRepository } from './base-repository';

export class MemberPasswordAuthRepository extends BaseRepository<MemberPasswordAuth> {
  constructor(
    @InjectRepository(MemberPasswordAuth)
    private memberPasswordAuthRepository: Repository<MemberPasswordAuth>,
  ) {
    super(memberPasswordAuthRepository, MemberPasswordAuth);
  }

  async create(data: MemberPasswordAuth, queryRunner?: QueryRunner) {
    await this.getRepository(queryRunner).save(data);
  }
}
