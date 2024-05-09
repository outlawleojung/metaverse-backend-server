import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';

import { MemberFurnitureItemInven } from '../entities/memberFurnitureItemInven.entity';
import { StartInventory } from '../entities/startInventory.entity';
import { ITEM_TYPE } from '@libs/constants';

export class MemberFurnitureItemInvenRepository extends BaseRepository<MemberFurnitureItemInven> {
  constructor(
    @InjectRepository(MemberFurnitureItemInven)
    private memberFurnitureItemInvenRepository: Repository<MemberFurnitureItemInven>,
    @InjectRepository(StartInventory)
    private startInventoryRepository: Repository<StartInventory>,
  ) {
    super(memberFurnitureItemInvenRepository, MemberFurnitureItemInven);
  }

  async findByMemberId(memberId: string, queryRunner?: QueryRunner) {
    return await this.getRepository(queryRunner).find({
      select: { itemId: true, num: true },
      where: {
        memberId: memberId,
      },
    });
  }

  async create(memberId: string, queryRunner: QueryRunner) {
    // 기본 인벤토리 설정 ( 인테리어)
    const memberFurnitureItemInven =
      await this.memberFurnitureItemInvenRepository.find({
        where: {
          memberId: memberId,
        },
      });

    if (memberFurnitureItemInven.length === 0) {
      const interiorItems = await this.startInventoryRepository
        .createQueryBuilder('startInventory')
        .innerJoinAndSelect('startInventory.Item', 'item')
        .where('Item.itemType = :itemType', { itemType: ITEM_TYPE.INTERIOR })
        .getMany();

      const invens = [];

      let num = 1;
      for (const item of interiorItems) {
        const inven = new MemberFurnitureItemInven();
        inven.memberId = memberId;
        inven.itemId = item.itemId;
        inven.num = num;

        invens.push(inven);

        num++;
      }

      // 한 번의 쿼리로 저장
      await queryRunner.manager
        .getRepository(MemberFurnitureItemInven)
        .insert(invens);
    }
  }
}
