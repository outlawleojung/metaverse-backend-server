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
    if (!memberId) {
      return null;
    }
    return await this.repository.findOneBy({ id: memberId });
  }

  async findByEmail(email: string): Promise<Member | null> {
    if (!email) {
      return null;
    }
    return await this.repository.findOneBy({ email });
  }

  async findByMemberIdForRefreshToken(
    memberId: string,
  ): Promise<Member | null> {
    if (!memberId) {
      return null;
    }
    return await this.repository.findOne({
      select: ['id', 'memberCode', 'nickname', 'email', 'refreshToken'],
      where: {
        id: memberId,
      },
    });
  }

  async findByMemberIdForAuthenticate(
    memberId: string,
  ): Promise<Member | null> {
    if (!memberId) {
      return null;
    }
    return await this.repository.findOne({
      select: ['id', 'memberCode', 'nickname', 'email'],
      where: {
        id: memberId,
      },
    });
  }

  async findByMemberCode(memberCode: string): Promise<Member | null> {
    if (!memberCode) {
      return null;
    }
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

  async findByMemberIdForMemberInfoAndAvatar(memberId: string) {
    if (!memberId) {
      return null;
    }

    const rawResults = await this.memberRepository
      .createQueryBuilder('m')
      .select([
        'm.memberCode as memberCode',
        'm.nickname as nickname',
        'm.stateMessage as stateMessage',
        'ai.avatarPartsType as avatarPartsType',
        'ai.itemId as itemId',
      ])
      .leftJoin('m.MemberAvatarInfos', 'ai')
      .where('m.id = :memberId', { memberId })
      .getRawMany();

    // 멤버 기본 정보 설정
    const memberInfo = {
      memberCode: rawResults[0].memberCode,
      nickname: rawResults[0].nickname,
      stateMessage: rawResults[0].stateMessage,
      avatarInfos: rawResults.map((item) => ({
        [item.avatarPartsType]: item.itemId,
      })),
    };

    return memberInfo;
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

  async findByMemberIdForMemberInfo(
    memberId: string,
    queryRunner?: QueryRunner,
  ) {
    return await this.getRepository(queryRunner).findOne({
      select: [
        'id',
        'memberCode',
        'providerType',
        'officeGradeType',
        'myRoomStateType',
        'nickname',
        'stateMessage',
      ],
      where: {
        id: memberId,
      },
    });
  }

  async gnenerateMemberCode(queryRunner?: QueryRunner) {
    // 유저코드 발급
    let memberCode = '';
    while (true) {
      memberCode = await this.randomString(12);

      const exMemberCode = await this.getRepository(queryRunner).findOne({
        where: {
          memberCode: memberCode,
        },
      });

      if (!exMemberCode) {
        return memberCode;
      }
    }
  }

  private randomString(num: number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    const stringLength = num;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }
}
