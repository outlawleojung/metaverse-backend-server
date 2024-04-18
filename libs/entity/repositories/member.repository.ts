import { DeleteResult, IsNull, Not, QueryRunner, Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';

export class MemberRepository extends BaseRepository<Member> {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {
    super(memberRepository, Member);
  }

  async findByMemberId(memberId: string): Promise<Member | null> {
    return await this.repository.findOneBy({ memberId });
  }

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
