import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';
import { MemberFriendRequest } from '../entities/memberFriendRequest.entity';

export class MemberFriendRequestRepository extends BaseRepository<MemberFriendRequest> {
  constructor(
    @InjectRepository(MemberFriendRequest)
    private memberFriendRequestRepository: Repository<MemberFriendRequest>,
  ) {
    super(memberFriendRequestRepository, MemberFriendRequest);
  }

  async findByReceivedMemberId(
    memberId: string,
  ): Promise<MemberFriendRequest[] | null> {
    const rawResults = await this.memberFriendRequestRepository
      .createQueryBuilder('fq')
      .select([
        'm.memberCode as friendMemberCode',
        'm.nickname as friendNickname',
        'm.stateMessage as friendMessage',
        'fq.createdAt as createdAt',
        'ai.avatarPartsType',
        'ai.itemId',
      ])
      .innerJoin('fq.ReceivedMember', 'm')
      .leftJoin('m.MemberAvatarInfos', 'ai')
      .where('fq.requestMemberId = :memberId', { memberId })
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

  async findByRequestMemberId(
    memberId: string,
  ): Promise<MemberFriendRequest[] | null> {
    const rawResults = await this.memberFriendRequestRepository
      .createQueryBuilder('fq')
      .select([
        'm.memberCode as friendMemberCode',
        'm.nickname as friendNickname',
        'm.stateMessage as friendMessage',
        'fq.createdAt as createdAt',
        'ai.avatarPartsType',
        'ai.itemId',
      ])
      .innerJoin('fq.RequestMember', 'm')
      .leftJoin('m.MemberAvatarInfos', 'ai')
      .where('fq.receivedMemberId = :memberId', { memberId })
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

  async findByRequestMemberIdAndReceivedMemberId(
    requestMemberId: string,
    receivedMemberId: string,
    queryRunner?: QueryRunner,
  ): Promise<MemberFriendRequest | null> {
    return await this.getRepository(queryRunner).findOneBy({
      requestMemberId,
      receivedMemberId,
    });
  }

  async exists(
    requestMemberId: string,
    receivedMemberId: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    return await this.getRepository(queryRunner).existsBy({
      requestMemberId,
      receivedMemberId,
    });
  }

  async managerFriendRequest(
    memberId: string,
    friendMemberId: string,
    maxCount: number,
    queryRunner?: QueryRunner,
  ) {
    // 새로운 친구 요청 저장
    const fr = new MemberFriendRequest();
    fr.requestMemberId = memberId;
    fr.receivedMemberId = friendMemberId;
    await this.getRepository(queryRunner).save(fr);

    // 요청 개수 확인
    const requestCount = await this.getRepository(queryRunner).count({
      where: { requestMemberId: memberId },
    });

    // 최대 수치 초과 시 오래된 요청 삭제
    if (requestCount > maxCount) {
      const oldestRequest = await this.getRepository(queryRunner).findOne({
        where: { requestMemberId: memberId },
        order: { createdAt: 'ASC' }, // 가장 오래된 요청 먼저
      });

      if (oldestRequest) {
        await this.getRepository(queryRunner).remove(oldestRequest);
      }
    }

    // 요청 받은 개수 확인
    const receivedCount = await this.getRepository(queryRunner).count({
      where: { receivedMemberId: friendMemberId },
    });

    // 최대 수치 초과 시 오래된 요청 삭제
    if (receivedCount > maxCount) {
      const oldestRequest = await this.getRepository(queryRunner).findOne({
        where: { receivedMemberId: friendMemberId },
        order: { createdAt: 'ASC' }, // 가장 오래된 요청 먼저
      });

      if (oldestRequest) {
        await this.getRepository(queryRunner).remove(oldestRequest);
      }
    }
  }

  async delete(
    requestMemberId: string,
    receivedMemberId: string,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    return await this.getRepository(queryRunner).delete({
      requestMemberId,
      receivedMemberId,
    });
  }
}
