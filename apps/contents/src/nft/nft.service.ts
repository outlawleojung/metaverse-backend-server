import { CommonService } from '@libs/common';
import { ERRORCODE, ERROR_MESSAGE } from '@libs/constants';
import { Member, MemberWalletInfo, MemberWalletLinkLog } from '@libs/entity';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberWalletInfo)
    private memberWalletInfoRepository: Repository<MemberWalletInfo>,
    @InjectRepository(MemberWalletLinkLog)
    private memberWalletLinkLogRepository: Repository<MemberWalletInfo>,
    private commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  private readonly logger = new Logger(NftService.name);

  // 지갑 주소 연동
  async linkedWallet(memberId: string, walletAddr: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 나의 지갑 주소 확인
      const exMemberWallet = await this.memberWalletInfoRepository.findOne({
        where: {
          memberId: memberId,
        },
      });

      // 나의 지갑 주소가 있는 경우
      if (exMemberWallet) {
        // 연동 되어 있는 지갑 주소와 연동 하려는 지갑 주소가 같은 경우
        if (exMemberWallet.walletAddr === walletAddr) {
          throw new ForbiddenException({
            error: ERRORCODE.NET_E_ALREADY_LINKED_SAME_WALLET_ADDR,
            message: ERROR_MESSAGE(
              ERRORCODE.NET_E_ALREADY_LINKED_SAME_WALLET_ADDR,
            ),
          });
        }
        // 나의 계정에 다른 지갑 주소가 연동 되어 있는 경우
        else {
          throw new ForbiddenException({
            error: ERRORCODE.NET_E_ALREADY_EXISTS_LINKED_WALLET_ADDR,
            message: ERROR_MESSAGE(
              ERRORCODE.NET_E_ALREADY_EXISTS_LINKED_WALLET_ADDR,
            ),
          });
        }
      }

      // 지갑 주소가 연동 되어 있는지 확인
      const exWallet = await this.memberWalletInfoRepository.findOne({
        where: {
          walletAddr: walletAddr,
        },
      });

      // 연동 하려는 지갑이 다른 계정과 연동되어 있는 경우
      if (exWallet) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_ALREADY_EXISTS_LINKED_ACCOUNT,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXISTS_LINKED_ACCOUNT),
        });
      }

      // 새 지갑 주소 연동
      const newMemberWallet = new MemberWalletInfo();
      newMemberWallet.memberId = memberId;
      newMemberWallet.walletAddr = walletAddr;

      await queryRunner.manager
        .getRepository(MemberWalletInfo)
        .insert(newMemberWallet);

      // 지갑 연동 로그
      const walletLinkLog = new MemberWalletLinkLog();
      walletLinkLog.memberId = memberId;
      walletLinkLog.walletAddr = walletAddr;
      walletLinkLog.linkType = 1;

      await queryRunner.manager
        .getRepository(MemberWalletLinkLog)
        .insert(walletLinkLog);

      await queryRunner.commitTransaction();

      return {
        walletAddr: walletAddr,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      console.log(err);
      this.logger.log(err);
      await queryRunner.rollbackTransaction();

      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_DB_FAILED,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } finally {
      await queryRunner.release();
    }
  }

  // 지갑 주소 해제
  async unLinkedWallet(memberId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 나의 지갑 주소 확인
      const exMemberWallet = await this.memberWalletInfoRepository.findOne({
        where: {
          memberId: memberId,
        },
      });

      // 연동된 지갑이 없음.
      if (!exMemberWallet) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXISTS_LINKED_WALLET_ADDR,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXISTS_LINKED_WALLET_ADDR),
        });
      }

      await queryRunner.manager
        .getRepository(MemberWalletInfo)
        .delete({ memberId });

      // 지갑 해제 로그
      const walletLinkLog = new MemberWalletLinkLog();
      walletLinkLog.memberId = memberId;
      walletLinkLog.walletAddr = exMemberWallet.walletAddr;
      walletLinkLog.linkType = 0;

      await queryRunner.manager
        .getRepository(MemberWalletLinkLog)
        .insert(walletLinkLog);

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      console.log(err);
      this.logger.log(err);
      await queryRunner.rollbackTransaction();
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_DB_FAILED,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } finally {
      await queryRunner.release();
    }
  }
}
