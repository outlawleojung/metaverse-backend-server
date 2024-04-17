import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLimit } from '../entities/emailLimit.entity';

export class EmailLimitRepository {
  constructor(
    @InjectRepository(EmailLimit) private repository: Repository<EmailLimit>,
  ) {}

  async findByEmail(email: string): Promise<EmailLimit | null> {
    return await this.repository.findOneBy({ email });
  }

  async update(email: string, count: number, queryRunner: QueryRunner) {
    await queryRunner.manager.getRepository<EmailLimit>(EmailLimit).update(
      {
        email,
      },
      { count },
    );
  }

  async create(email, queryRunner: QueryRunner) {
    const emailLimit = new EmailLimit();
    emailLimit.email = email;
    emailLimit.count = 0;
    await queryRunner.manager
      .getRepository<EmailLimit>(EmailLimit)
      .save(emailLimit);
  }
  // async findByEmailAndAuthCode(
  //   email: string,
  //   authCode: number,
  // ): Promise<EmailCheck | null> {
  //   return await this.repository.findOne({
  //     where: {
  //       email,
  //       authCode,
  //     },
  //   });
  // }

  // async delete(id: number): Promise<DeleteResult> {
  //   return await this.repository.delete({ id });
  // }
}
