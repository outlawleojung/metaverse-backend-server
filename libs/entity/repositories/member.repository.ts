import { QueryRunner, Repository } from 'typeorm';
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

  async checkIfNicknameExists(nickname: string): Promise<boolean> {
    const count = await this.repository.countBy({ nickname });
    return count > 0;
  }

  async updateMemberProfile(
    memberId: string,
    nickname: string,
    stateMessage: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const memberProfile = new Member();
    memberProfile.memberId = memberId;
    memberProfile.nickname = nickname;
    memberProfile.stateMessage = stateMessage;

    await queryRunner.manager.getRepository(Member).save(memberProfile);
  }
}
