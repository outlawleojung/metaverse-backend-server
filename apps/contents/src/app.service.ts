import { CommonService } from '@libs/common';
import { ITEM_TYPE } from '@libs/constants';
import {
  MemberAvatarPartsItemInven,
  MemberFurnitureItemInven,
  StartInventory,
} from '@libs/entity';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class AppService {
  constructor(@Inject(DataSource) private dataSource: DataSource) {}

  getHello(): string {
    return `${process.env.BRANCH_NAME} MOASIS CONTENT SERVER !`;
  }

  async interiorInven() {
    return true;
  }
  async getItemNum(queryRunner: QueryRunner, memberId: string) {
    const maxNum = await queryRunner.manager
      .getRepository(MemberFurnitureItemInven)
      .createQueryBuilder('m')
      .select('MAX(m.num)', 'maxNum')
      .where('m.memberId = :memberId', { memberId })
      .getRawOne();
    return maxNum ? maxNum.maxNum : 0;
  }

  initAvatarInven = async () => {
    const memberIds = [];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const avatarPartsItems = await this.dataSource
        .getRepository(StartInventory)
        .createQueryBuilder('startInventory')
        .innerJoinAndSelect('startInventory.Item', 'item')
        .where('Item.itemType = :itemType', { itemType: ITEM_TYPE.COSTUME })
        .getMany();

      for (const memberId of memberIds) {
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

      for (const memberId of memberIds) {
        const avatarInven = await queryRunner.manager
          .getRepository(MemberAvatarPartsItemInven)
          .find({
            where: {
              memberId: memberId,
            },
          });

        console.log(avatarInven);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  };
}
