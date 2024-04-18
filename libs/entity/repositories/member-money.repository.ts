import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';

import { MemberMoney } from '../entities/memberMoney.entity';

export class MemberMoneyRepository extends BaseRepository<MemberMoney> {
  constructor(
    @InjectRepository(MemberMoney)
    private memberMoneyRepository: Repository<MemberMoney>,
  ) {
    super(memberMoneyRepository, MemberMoney);
  }

  async addMemberMoney(
    memberId: string,
    moneyType: number,
    count: number,
    queryRunner: QueryRunner,
  ): Promise<MemberMoney> {
    const memberMoney = await this.getRepository(queryRunner).findOneBy({
      memberId,
      moneyType,
    });

    let addCount = count;
    if (memberMoney) {
      addCount += memberMoney.count;
    }

    const newMemberMoney = new MemberMoney();
    newMemberMoney.memberId = memberId;
    newMemberMoney.moneyType = moneyType;
    newMemberMoney.count = addCount;

    return await this.getRepository(queryRunner).save(newMemberMoney);
  }
}
