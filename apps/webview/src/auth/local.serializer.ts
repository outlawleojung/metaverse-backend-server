import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { Member } from '@libs/entity';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  private readonly logger = new Logger(LocalSerializer.name);
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {
    super();
  }

  serializeUser(member: Member, done: CallableFunction) {
    done(null, member.memberId);
  }

  async deserializeUser(memberId: string, done: CallableFunction) {
    return await this.memberRepository
      .findOneOrFail({
        where: { memberId: memberId },
        select: ['memberId', 'memberCode', 'providerType', 'email', 'nickname'],
      })
      .then((member) => {
        done(null, member);
      })
      .catch((error) => done(error));
  }
}
