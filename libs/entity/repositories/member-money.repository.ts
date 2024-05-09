import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';

import { MemberMoney } from '../entities/memberMoney.entity';
import { MoneyType } from '../entities/moneyType.entity';

export class MemberMoneyRepository extends BaseRepository<MemberMoney> {
  constructor(
    @InjectRepository(MemberMoney)
    private memberMoneyRepository: Repository<MemberMoney>,
    @InjectRepository(MoneyType)
    private moneyTypeRepository: Repository<MoneyType>,
  ) {
    super(memberMoneyRepository, MemberMoney);
  }

  async findAllByMemberId(memberId: string) {
    const memberMoney = await this.moneyTypeRepository
      .createQueryBuilder('moneyType')
      .select([
        'moneyType.type AS moneyType', // "moneyType" 열을 "moneyType"으로 별칭
        'COALESCE(SUM(mm.count), 0) AS count', // SUM 집계와 COALESCE 처리를 포함
      ])
      .leftJoin('moneyType.MemberMoney', 'mm', 'mm.memberId = :memberId', {
        memberId,
      })
      .groupBy('moneyType.type') // moneyType.type 별로 그룹화
      .getRawMany(); // 원시 결과 배열로 가져오기

    // 결과 배열에서 각 항목의 count 속성을 정수로 변환
    memberMoney.forEach((m) => {
      m.count = parseInt(m.count, 10); // 문자열 count를 정수로 변환
    });

    return memberMoney;
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
