import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberPasswordAuth } from '../entities/memberPasswordAuth.entity';

export class MemberPasswordAuthRepository {
  constructor(
    @InjectRepository(MemberPasswordAuth)
    private repository: Repository<MemberPasswordAuth>,
  ) {}

  async create(data: MemberPasswordAuth, queryRunner: QueryRunner) {
    await queryRunner.manager
      .getRepository<MemberPasswordAuth>(MemberPasswordAuth)
      .save(data);
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

  // async deleteById(
  //   id: number,
  //   queryRunner?: QueryRunner,
  // ): Promise<DeleteResult> {
  //   return await this.getRepository(queryRunner).delete({ id });
  // }

  // async deleteByExists(email: string, queryRunner?: QueryRunner) {
  //   await this.repository.findOne({ where: { email } }).then(async (data) => {
  //     if (data) {
  //       (await this.getRepository(queryRunner)).delete({ id: data.id });
  //     }
  //   });
  // }

  // async create(email: string, authCode: number, queryRunner: QueryRunner) {
  //   await queryRunner.manager
  //     .getRepository<EmailCheck>(EmailCheck)
  //     .save({ email, authCode });
  // }

  private getRepository(queryRunner?: QueryRunner) {
    return queryRunner
      ? queryRunner.manager.getRepository<MemberPasswordAuth>(
          MemberPasswordAuth,
        )
      : this.repository;
  }
}
