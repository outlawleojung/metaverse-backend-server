import { MemberAvatarPartsItemInven, StartInventory } from '@libs/entity';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';
import { ITEM_TYPE } from '@libs/constants';

export class MemberAvatarPartsItemInvenRepository extends BaseRepository<MemberAvatarPartsItemInven> {
  constructor(
    @InjectRepository(MemberAvatarPartsItemInven)
    private memberAvatarPartsItemInvenRepository: Repository<MemberAvatarPartsItemInven>,
    @InjectRepository(StartInventory)
    private startInventoryRepository: Repository<StartInventory>,
  ) {
    super(memberAvatarPartsItemInvenRepository, MemberAvatarPartsItemInven);
  }

  async findByMemberId(memberId: string, queryRunner?: QueryRunner) {
    return await this.getRepository(queryRunner).find({
      select: { itemId: true },
      where: {
        memberId: memberId,
      },
    });
  }

  async create(memberId: string, queryRunner?: QueryRunner) {
    const memberAvatarPartsItemInven = await this.getRepository(
      queryRunner,
    ).find({
      where: {
        memberId: memberId,
      },
    });

    if (memberAvatarPartsItemInven.length === 0) {
      const avatarPartsItems = await this.startInventoryRepository
        .createQueryBuilder('startInventory')
        .innerJoinAndSelect('startInventory.Item', 'item')
        .where('Item.itemType = :itemType', { itemType: ITEM_TYPE.COSTUME })
        .getMany();

      // 레코드 배열 생성
      const memberAvatarPartsItemInvens = avatarPartsItems.map((item) => {
        const memberAvatarPartsItemInven = new MemberAvatarPartsItemInven();
        memberAvatarPartsItemInven.memberId = memberId;
        memberAvatarPartsItemInven.itemId = item.itemId;
        return memberAvatarPartsItemInven;
      });

      // 한 번에 여러 레코드 저장
      await queryRunner.manager
        .getRepository(MemberAvatarPartsItemInven)
        .insert(memberAvatarPartsItemInvens);
    }
  }
}
