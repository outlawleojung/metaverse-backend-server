import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';
import { MemberFriend } from '../entities/memberFriend.entity';

export class MemberFriendRepository extends BaseRepository<MemberFriend> {
  constructor(
    @InjectRepository(MemberFriend)
    private memberFriendRepository: Repository<MemberFriend>,
  ) {
    super(memberFriendRepository, MemberFriend);
  }

  async findByMemberIdAndFriendMemberId(
    memberId: string,
    friendMemberId: string,
    queryRunner?: QueryRunner,
  ): Promise<MemberFriend | null> {
    return await this.getRepository(queryRunner).findOneBy({
      memberId,
      friendMemberId,
    });
  }

  async count(memberId: string): Promise<number | null> {
    return await this.memberFriendRepository.count({
      where: { memberId },
    });
  }

  async exists(
    memberId: string,
    friendMemberId: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    return await this.getRepository(queryRunner).existsBy({
      memberId,
      friendMemberId,
    });
  }

  async create(data: Partial<MemberFriend>, queryRunner?: QueryRunner) {
    const { memberId, friendMemberId } = data;
    const friend = await this.exists(memberId, friendMemberId, queryRunner);
    if (friend) {
      throw new Error('Already Friend');
    }

    await this.getRepository(queryRunner).save(data);
  }

  async delete(
    memberId: string,
    friendMemberId: string,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    return await this.getRepository(queryRunner).delete({
      memberId,
      friendMemberId,
    });
  }
}
