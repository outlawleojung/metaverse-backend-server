import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';
import { MemberBlock } from '../entities/memberBlock.entity';

export class MemberBlockRepository extends BaseRepository<MemberBlock> {
  constructor(
    @InjectRepository(MemberBlock)
    private memberBlockRepository: Repository<MemberBlock>,
  ) {
    super(memberBlockRepository, MemberBlock);
  }

  async findByMemberIdForBlockMemberInfo(memberId: string) {
    const rawResults = await this.memberBlockRepository
      .createQueryBuilder('mb')
      .select([
        'm.memberCode as memberCode',
        'm.nickname as nickname',
        'm.stateMessage as stateMessage',
        'ai.avatarPartsType as avatarPartsType',
        'ai.itemId as itemId',
      ])
      .innerJoin('mb.MemberBlock', 'm')
      .leftJoin('m.MemberAvatarInfos', 'ai')
      .where('mb.memberId = :memberId', { memberId })
      .getRawMany();

    // Reduce the raw results into structured friend objects
    const memberBlocks = rawResults.reduce((acc, item) => {
      const { memberCode, nickname, stateMessage, avatarPartsType, itemId } =
        item;

      // Create a unique key for each friend
      const key = memberCode;

      // Initialize if this friend is not already processed
      if (!acc[key]) {
        acc[key] = {
          memberCode,
          nickname,
          stateMessage,
          avatarInfos: [],
        };
      }

      // Add avatar info if available
      if (avatarPartsType !== null) {
        acc[key].avatarInfos.push({
          [avatarPartsType]: itemId,
        });
      }

      return acc;
    }, {});

    // Convert the accumulated object back to an array
    return Object.values(memberBlocks);
  }

  async exists(
    memberId: string,
    blockMemberId: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    return await this.getRepository(queryRunner).existsBy({
      memberId,
      blockMemberId,
    });
  }

  async create(data: Partial<MemberBlock>, queryRunner?: QueryRunner) {
    const { memberId, blockMemberId } = data;

    if (this.exists(memberId, blockMemberId, queryRunner)) {
      throw new Error('Exists Member Block');
    }

    await this.getRepository(queryRunner).save(data);
  }

  async delete(
    memberId: string,
    blockMemberId: string,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    return await this.getRepository(queryRunner).delete({
      memberId,
      blockMemberId,
    });
  }
}
