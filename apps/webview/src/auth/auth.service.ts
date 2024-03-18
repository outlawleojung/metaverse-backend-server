import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
  Jwt,
  JwtPayload,
} from 'jsonwebtoken';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Member, MemberAccount } from '@libs/entity';
import { CommonService, Decrypt, JwtService } from '@libs/common';

type Token = {
  idx: string;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberAccount)
    private memberAccountRepository: Repository<MemberAccount>,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateUser(token: string, password: string) {
    const jwtToken: Member | Jwt | JwtPayload | string | number =
      await this.jwtService.verifyToken(String(Decrypt(token)));

    const _token = jwtToken as Token;
    const member = await this.memberRepository.findOne({
      select: ['memberId', 'memberCode', 'providerType', 'email', 'nickname'],
      where: {
        memberId: _token.idx,
      },
    });

    console.log('_token.idx : ', _token.idx);
    console.log('return user: ', member);
    return member;
  }
}
