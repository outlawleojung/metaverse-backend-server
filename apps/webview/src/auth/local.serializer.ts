import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '@libs/entity';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  private readonly logger = new Logger(LocalSerializer.name);
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {
    super();
  }

  serializeUser(member: Member, done: CallableFunction) {
    done(null, member.id);
  }

  async deserializeUser(memberId: string, done: CallableFunction) {
    return await this.memberRepository
      .findOneOrFail({
        where: { id: memberId },
        select: ['id', 'memberCode', 'providerType', 'email', 'nickname'],
      })
      .then((member) => {
        done(null, member);
      })
      .catch((error) => done(error));
  }
}
