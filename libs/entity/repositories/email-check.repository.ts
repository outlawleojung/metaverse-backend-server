import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailCheck } from '../entities/emailCheck.entity';
import { BaseRepository } from './base-repository';

export class EmailCheckRepository extends BaseRepository<EmailCheck> {
  constructor(
    @InjectRepository(EmailCheck)
    private emailCheckRepository: Repository<EmailCheck>,
  ) {
    super(emailCheckRepository, EmailCheck);
  }

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
}
