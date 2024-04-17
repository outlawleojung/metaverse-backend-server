import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailConfirm } from '../entities/emailConfirm.entity';

export class EmailConfirmRepository {
  constructor(
    @InjectRepository(EmailConfirm)
    private repository: Repository<EmailConfirm>,
  ) {}

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

  async create(email: string, queryRunner: QueryRunner) {
    const emailConfirm = new EmailConfirm();
    emailConfirm.email = email;

    await queryRunner.manager
      .getRepository<EmailConfirm>(EmailConfirm)
      .save(emailConfirm);
  }

  private getRepository(queryRunner?: QueryRunner) {
    return queryRunner
      ? queryRunner.manager.getRepository<EmailConfirm>(EmailConfirm)
      : this.repository;
  }
}
