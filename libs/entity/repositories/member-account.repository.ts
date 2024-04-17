import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberAccount } from '../entities/memberAccount.entity';

export class MemberAccountRepository {
  constructor(
    @InjectRepository(MemberAccount)
    private repository: Repository<MemberAccount>,
  ) {}

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
}
