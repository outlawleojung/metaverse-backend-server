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

  async existsByAccountTokenAndProviderType(
    accountToken: string,
    providerType: number,
    queryRunner?: QueryRunner,
  ) {
    return this.getRepository(queryRunner).existsBy({
      accountToken,
      providerType,
    });
  }

  async updateMemberAccount(
    data: Partial<MemberAccount>,
    queryRunner?: QueryRunner,
  ): Promise<MemberAccount> {
    const { memberId, providerType, ...updateData } = data;

    const ma = await this.getRepository(queryRunner).findOne({
      where: {
        memberId,
        providerType,
      },
    });

    if (!ma) {
      throw new Error('MemberAccount not found');
    }

    Object.assign(ma, updateData);

    return await this.getRepository(queryRunner).save(ma);
  }

  async create(data: Partial<MemberAccount>, queryRunner?: QueryRunner) {
    const { memberId, providerType } = data;
    const ma = await this.getRepository(queryRunner).findOne({
      where: {
        memberId,
        providerType,
      },
    });

    if (!ma) {
      throw new Error('MemberAccount not found');
    }

    return await this.getRepository(queryRunner).save(ma);
  }
}
