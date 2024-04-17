import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberAccount } from '../entities/memberAccount.entity';
import { BaseRepository } from './base-repository';
import { PROVIDER_TYPE } from '@libs/constants';

export class MemberAccountRepository extends BaseRepository<MemberAccount> {
  constructor(
    @InjectRepository(MemberAccount)
    private memberAccountRepository: Repository<MemberAccount>,
  ) {
    super(memberAccountRepository, MemberAccount);
  }

  async findByAccountTokenAndProviderType(
    providerType: number,
    accountToken: string,
  ): Promise<MemberAccount | null> {
    return await this.repository.findOneBy({ providerType, accountToken });
  }

  async findByAccountToken(
    accountToken: string,
  ): Promise<MemberAccount | null> {
    return await this.repository.findOneBy({ accountToken });
  }

  async findByMemberIdForSocialInfo(
    memberId: string,
  ): Promise<MemberAccount[] | null> {
    return await this.repository.find({
      select: { providerType: true, accountToken: true },
      where: { memberId },
    });
  }

  async findByMemberIdAndProviderType(
    memberId: string,
    providerType: number,
  ): Promise<MemberAccount | null> {
    return await this.repository.findOne({ where: { providerType, memberId } });
  }

  async updateEmail(
    memberId: string,
    email: string,
    queryRunner?: QueryRunner,
  ) {
    await this.getRepository(queryRunner).update(
      { memberId, providerType: PROVIDER_TYPE.ARZMETA },
      { accountToken: email },
    );
  }
}
