import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';

import { FunctionTable } from '../entities/functionTable.entity';

export class FunctionTableRepository extends BaseRepository<FunctionTable> {
  constructor(
    @InjectRepository(FunctionTable)
    private functionTableRepository: Repository<FunctionTable>,
  ) {
    super(functionTableRepository, FunctionTable);
  }

  async findById(id: number): Promise<FunctionTable | null> {
    return await this.functionTableRepository.findOneBy({ id });
  }
}
