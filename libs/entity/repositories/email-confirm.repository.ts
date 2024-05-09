import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailConfirm } from '../entities/emailConfirm.entity';
import { BaseRepository } from './base-repository';

export class EmailConfirmRepository extends BaseRepository<EmailConfirm> {
  constructor(
    @InjectRepository(EmailConfirm)
    private emailConfirmrepository: Repository<EmailConfirm>,
  ) {
    super(emailConfirmrepository, EmailConfirm);
  }

  async existsByEmail(email: string, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).existsBy({
      email,
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete({ id });
  }

  async deleteByExists(email: string, queryRunner?: QueryRunner) {
    await this.repository.findOne({ where: { email } }).then(async (data) => {
      if (data) {
        this.getRepository(queryRunner).delete({ id: data.id });
      }
    });
  }

  async create(email: string, queryRunner?: QueryRunner) {
    const emailConfirm = new EmailConfirm();
    emailConfirm.email = email;

    await this.getRepository(queryRunner).save(emailConfirm);
  }
}
