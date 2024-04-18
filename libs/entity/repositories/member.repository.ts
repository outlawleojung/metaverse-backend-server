import { DeleteResult, IsNull, Not, QueryRunner, Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';
import { FRND_REQUEST_TYPE } from '@libs/constants';

export class MemberRepository extends BaseRepository<Member> {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {
    super(memberRepository, Member);
  }

  async findByMemberId(memberId: string): Promise<Member | null> {
    return await this.repository.findOneBy({ memberId });
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
      select: { memberId: true, deletedAt: true },
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
      select: { memberId: true },
      where,
    });

    return member;
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
    const { memberId, ...updateData } = data;

    const member = await this.getRepository(queryRunner).findOne({
      where: {
        memberId,
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
