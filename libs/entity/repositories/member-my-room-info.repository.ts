import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';

import { MemberMyRoomInfo } from '../entities/memberMyRoomInfo.entity';
import { StartMyRoom } from '../entities/startMyRoom.entity';
import { MemberFurnitureItemInven } from '../entities/memberFurnitureItemInven.entity';

export class MemberMyRoomInfoRepository extends BaseRepository<MemberMyRoomInfo> {
  constructor(
    @InjectRepository(MemberMyRoomInfo)
    private memberMyRoomInfoRepository: Repository<MemberMyRoomInfo>,
    @InjectRepository(StartMyRoom)
    private startMyRoomRepository: Repository<StartMyRoom>,
    @InjectRepository(MemberFurnitureItemInven)
    private memberFurnitureItemInvenRepository: Repository<MemberFurnitureItemInven>,
  ) {
    super(memberMyRoomInfoRepository, MemberMyRoomInfo);
  }

  async findByMemberId(memberId: string, queryRunner?: QueryRunner) {
    return await this.getRepository(queryRunner).find({
      select: {
        itemId: true,
        num: true,
        layerType: true,
        x: true,
        y: true,
        rotation: true,
      },
      where: {
        memberId: memberId,
      },
    });
  }

  async create(memberId: string, queryRunner?: QueryRunner) {
    const memberMyRoomInfo = await this.getRepository(queryRunner).find({
      where: {
        memberId: memberId,
      },
    });

    if (memberMyRoomInfo.length === 0) {
      const defaultMyRoomItems = await this.startMyRoomRepository.find();

      const memberInvens = await this.memberFurnitureItemInvenRepository.find({
        where: {
          memberId: memberId,
        },
      });

      const myRoomInfosToInsert = [];

      for (const item of defaultMyRoomItems) {
        const matchingInvens = memberInvens.filter(
          (inven) => inven.itemId === item.itemId,
        );

        for (const inven of matchingInvens) {
          const isDuplicated = myRoomInfosToInsert.some(
            (item) =>
              inven.memberId === memberId &&
              inven.itemId === item.itemId &&
              inven.num === item.num,
          );

          if (!isDuplicated) {
            const myRoomInfo = new MemberMyRoomInfo();
            myRoomInfo.memberId = memberId;
            myRoomInfo.itemId = item.itemId;
            myRoomInfo.num = inven.num;
            myRoomInfo.layerType = item.layerType;
            myRoomInfo.x = item.x;
            myRoomInfo.y = item.y;
            myRoomInfo.rotation = item.rotation;
            myRoomInfosToInsert.push(myRoomInfo);
            break;
          }
        }
      }

      if (myRoomInfosToInsert.length > 0) {
        await queryRunner.manager
          .getRepository(MemberMyRoomInfo)
          .insert(myRoomInfosToInsert);
      }
    }
  }
}
