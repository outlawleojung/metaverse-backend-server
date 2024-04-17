import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLimit } from '../entities/emailLimit.entity';
import { BaseRepository } from './base-repository';

export class EmailLimitRepository extends BaseRepository<EmailLimit> {
  constructor(
    @InjectRepository(EmailLimit)
    private emailLimitRepository: Repository<EmailLimit>,
  ) {
    super(emailLimitRepository, EmailLimit);
  }

  async findByEmail(email: string): Promise<EmailLimit | null> {
    return await this.repository.findOneBy({ email });
  }

  async update(email: string, count: number, queryRunner?: QueryRunner) {
    await this.getRepository(queryRunner).update(
      {
        email,
      },
      { count },
    );
  }

  async create(email, queryRunner?: QueryRunner) {
    const emailLimit = new EmailLimit();
    emailLimit.email = email;
    emailLimit.count = 0;
    await this.getRepository(queryRunner).save(emailLimit);
  }
}
