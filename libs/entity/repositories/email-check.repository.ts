import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailCheck } from '../entities/emailCheck.entity';

export class EmailCheckRepository {
  constructor(
    @InjectRepository(EmailCheck) private repository: Repository<EmailCheck>,
  ) {}

  async findByEmailAndAuthCode(
    email: string,
    authCode: number,
  ): Promise<EmailCheck | null> {
    return await this.repository.findOne({
      where: {
        email,
        authCode,
      },
    });
  }

  async deleteById(
    id: number,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    return await this.getRepository(queryRunner).delete({ id });
  }

  async deleteByExists(email: string, queryRunner?: QueryRunner) {
    await this.repository.findOne({ where: { email } }).then(async (data) => {
      if (data) {
        (await this.getRepository(queryRunner)).delete({ id: data.id });
      }
    });
  }

  async create(email: string, authCode: number, queryRunner: QueryRunner) {
    await queryRunner.manager
      .getRepository<EmailCheck>(EmailCheck)
      .save({ email, authCode });
  }

  private getRepository(queryRunner?: QueryRunner) {
    return queryRunner
      ? queryRunner.manager.getRepository<EmailCheck>(EmailCheck)
      : this.repository;
  }
}
