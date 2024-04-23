import { DeleteResult, IsNull, Not, QueryRunner, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';
import { FRND_REQUEST_TYPE } from '@libs/constants';
import { Member } from '../entities/member.entity';

export class MemberRepository extends BaseRepository<Member> {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {
    super(memberRepository, Member);
  }

  async findByMemberId(memberId: string): Promise<Member | null> {
    return await this.repository.findOneBy({ id: memberId });
  }

  async findByMemberCode(memberCode: string): Promise<Member | null> {
    return await this.repository.findOne({ where: { memberCode } });
  }

  /**
   * 소프트 삭제 된 회원 목록 조회
   * @param queryRunner
   * @returns
   */
  async findAllForDeleteMembers(
    queryRunner?: QueryRunner,
  ): Promise<Member[] | null> {
    return await this.getRepository(queryRunner).find({
      select: { id: true, deletedAt: true },
      where: {
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
    });
  }

  async findByRequestTypeForFriend(
    requestType: number,
    friendId: string,
    queryRunner?: QueryRunner,
  ): Promise<Member | null> {
    let where: any = {};

    switch (requestType) {
      case FRND_REQUEST_TYPE.MEMBER_CODE:
        where = { memberCode: friendId };
        break;
      case FRND_REQUEST_TYPE.NICKNAME:
        where = { nickname: friendId };
        break;
      default:
        throw new Error('Request Type 이 잘목 됐습니다.');
    }

    const member = await this.getRepository(queryRunner).findOne({
      select: { id: true },
      where,
    });

    return member;
  }

  async findByMemberIdForMemberInfo(
    memberId: string,
  ): Promise<Member[] | null> {
    const rawResults = await this.memberRepository
      .createQueryBuilder('m')
      .select([
        'm.memberCode as memberCode',
        'm.nickname as nickname',
        'm.stateMessage as stateMessage',
        'ai.avatarPartsType',
        'ai.itemId',
      ])
      .leftJoin('m.MemberAvatarInfos', 'ai')
      .where('m.memberId = :memberId', { memberId })
      .getRawMany();

    // Reduce the raw results into structured friend objects
    const friends = rawResults.reduce((acc, item) => {
      const { friendMemberCode, friendNickname, friendMessage, createdAt } =
        item;

      // Create a unique key for each friend
      const key = friendMemberCode;

      // Initialize if this friend is not already processed
      if (!acc[key]) {
        acc[key] = {
          friendMemberCode,
          friendNickname,
          friendMessage,
          createdAt,
          avatarInfos: [],
        };
      }

      // Add avatar info if available
      if (item.ai_avatarPartsType !== null) {
        acc[key].avatarInfos.push({
          avatarPartsType: item.ai_avatarPartsType,
          itemId: item.ai_itemId,
        });
      }

      return acc;
    }, {});

    // Convert the accumulated object back to an array
    return Object.values(friends);
  }

  /**
   * 닉네임 중복 체크를 위한 조회
   * @param nickname
   * @returns
   */
  async checkIfNicknameExists(nickname: string): Promise<boolean> {
    const count = await this.repository.countBy({ nickname });
    return count > 0;
  }

  async updateMember(
    data: Partial<Member>,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const { id, ...updateData } = data;

    const member = await this.getRepository(queryRunner).findOne({
      where: {
        id,
      },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    Object.assign(member, updateData);

    await this.getRepository(queryRunner).save(member);
  }

  async delete(
    memberId: string,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    return await this.getRepository(queryRunner).delete(memberId);
  }

  async softDelete(
    memberId: string,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    return await this.getRepository(queryRunner).softDelete(memberId);
  }
}
