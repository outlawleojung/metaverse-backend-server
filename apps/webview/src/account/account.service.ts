import bcryptjs from 'bcryptjs';
import { PROVIDER_TYPE } from '@libs/constants';
import {
  Injectable,
  Inject,
  ForbiddenException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  KtmfEventEmailInfo,
  Member,
  MemberAccount,
  MemberPasswordAuth,
} from '@libs/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordtDto } from './dto/req/reset.password.dto';
import { KtmfEmailDto } from './dto/req/ktmf.email.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(AccountService.name);

  // 회원 탈퇴
  async withdrawal(memberId: string) {
    // 사용자 존재 여부 확인
    const exMember = await this.memberRepository.findOne({
      where: { id: memberId },
    });

    if (!exMember) {
      throw new ForbiddenException('사용자를 찾을 수 없음.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const upMember = new Member();
      upMember.id = memberId;
      upMember.deletedAt = new Date();

      await queryRunner.manager.getRepository(Member).save(upMember);
      await queryRunner.commitTransaction();

      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  // 패스워드 재설정
  async resetPassword(data: ResetPasswordtDto) {
    // 토큰 검증
    const memberPasswordAuth = await this.dataSource
      .getRepository(MemberPasswordAuth)
      .createQueryBuilder('m')
      .where('m.token = :token', { token: data.token })
      .getOne();

    const now = new Date();
    const limitTime = new Date(
      now.setSeconds(now.getSeconds() - memberPasswordAuth.ttl),
    );
    if (!memberPasswordAuth || memberPasswordAuth.createdAt > limitTime) {
      throw new ForbiddenException('만료 된 토큰입니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const memberAccount = new MemberAccount();
      memberAccount.memberId = memberPasswordAuth.memberId;
      memberAccount.providerType = PROVIDER_TYPE.ARZMETA;

      // 패스워드 설정
      const hashedPassword = await bcryptjs.hash(data.password, 12);
      memberAccount.password = hashedPassword;

      await queryRunner.manager
        .getRepository(MemberAccount)
        .save(memberAccount);
      await queryRunner.manager
        .getRepository(MemberPasswordAuth)
        .delete({ memberId: memberPasswordAuth.memberId });

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async ktmfEmail(memberId: string, data: KtmfEmailDto) {
    // 사용자 존재 여부 확인
    const exMember = await this.memberRepository.findOne({
      where: { id: memberId },
    });

    if (!exMember) {
      throw new ForbiddenException('사용자를 찾을 수 없음.');
    }

    // 이메일 등록 여부
    const ktmfEmail = await this.dataSource
      .getRepository(KtmfEventEmailInfo)
      .findOne({
        where: {
          memberId: memberId,
        },
      });

    if (ktmfEmail) {
      throw new ForbiddenException('이미 등록 되어 있습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ktmfEmail = new KtmfEventEmailInfo();
      ktmfEmail.memberId = memberId;
      ktmfEmail.email = data.email;

      await queryRunner.manager
        .getRepository(KtmfEventEmailInfo)
        .save(ktmfEmail);
      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB failure !!');
    } finally {
      await queryRunner.release();
    }
  }
}
