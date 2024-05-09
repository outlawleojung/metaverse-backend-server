import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base-repository';

import { MemberFrameImage } from '../entities/memberFrameImage.entity';

export class MemberFrameImageRepository extends BaseRepository<MemberFrameImage> {
  constructor(
    @InjectRepository(MemberFrameImage)
    private memberFrameImageRepository: Repository<MemberFrameImage>,
  ) {
    super(memberFrameImageRepository, MemberFrameImage);
  }

  async findByMemberId(memberId: string, queryRunner?: QueryRunner) {
    return await this.getRepository(queryRunner).find({
      select: ['itemId', 'num', 'uploadType', 'imageName'],
      where: {
        memberId: memberId,
      },
    });
  }
}
