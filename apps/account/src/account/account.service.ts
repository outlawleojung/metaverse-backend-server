import { AutoLoginDto } from './dto/request/auto.login.dto';
import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, QueryRunner, Repository } from 'typeorm';
import { v1 } from 'uuid';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Decrypt, CommonService } from '@libs/common';
import {
  ERRORCODE,
  ERROR_MESSAGE,
  MONEY_TYPE,
  PROVIDER_TYPE,
} from '@libs/constants';
import {
  EmailCheck,
  EmailConfirm,
  Member,
  MemberAccount,
  EmailLimit,
  MemberPasswordAuth,
  MemberWalletInfo,
  KtmfNftTokenToWallet,
  MemberNftRewardLog,
  KtmfNftToken,
  MemberMoney,
} from '@libs/entity';
import { SignMemberDto } from './dto/request/sign.member.dto';
import { LogInMemberDto } from './dto/request/login.member.dto';
import { MailService, EmailOptions } from '../mail/mail.service';
import { LoginAuthDto } from './dto/request/login.auth.dto';
import { AuthEmailDto } from './dto/request/auth.email.dto';
import { ConfirmEmailDto } from './dto/request/confirm.email.dto';
import { ResetPasswordDto } from './dto/request/reset.password.dto';
import { ArzmetaLogInMemberDto } from './dto/request/arzmeta.login.member.dto';
import { LinkedAccountDto } from './dto/request/linked.account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberAccount)
    private memberAccountRepository: Repository<MemberAccount>,
    @InjectRepository(EmailCheck)
    private emailCheckRepository: Repository<EmailCheck>,
    @InjectRepository(EmailConfirm)
    private emailConfirmRepository: Repository<EmailConfirm>,
    private commonService: CommonService,
    private mailService: MailService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(AccountService.name);

  // 이메일 인증 번호 받기
  async authEmail(authEmail: AuthEmailDto) {
    const email = String(authEmail.email);
    const remainTime = Number(process.env.MAIL_REMAIN_MINIUTE || 3) * 60 * 1000;

    if (email.length < 6) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_INVALID_EMAIL,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_INVALID_EMAIL),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 사용자 존재 여부 확인
    const memberAccount = await this.memberAccountRepository.findOne({
      where: {
        accountToken: email,
      },
    });

    if (memberAccount) {
      const member = await this.memberRepository.findOne({
        where: {
          memberId: memberAccount.memberId,
        },
      });

      const socialLoginInfo = await this.memberAccountRepository.find({
        select: { providerType: true, accountToken: true },
        where: {
          memberId: memberAccount.memberId,
        },
      });

      const avatarInfos = await this.commonService.getMemberAvatarInfo(
        member.memberCode,
      );
      const memberInfo: any = {
        nickname: member.nickname,
        stateMessage: member.stateMessage,
        socialLoginInfo: socialLoginInfo,
        memberCode: member.memberCode,
        avatarInfos: avatarInfos,
      };

      return {
        error: ERRORCODE.NET_E_ALREADY_EXIST_EMAIL,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXIST_EMAIL),
        memberInfo: memberInfo,
      };
    }

    // 이메일 횟수 제한 체크
    const emailLimit = await this.dataSource.getRepository(EmailLimit).findOne({
      where: {
        email: email,
      },
    });

    const now = new Date();
    const today = dayjs(now).format('YYYY.MM.DD');
    let lastUpdatedAt;

    if (emailLimit) {
      lastUpdatedAt = dayjs(emailLimit.updatedAt).format('YYYY.MM.DD');
      if (today <= lastUpdatedAt) {
        if (emailLimit.count >= 10) {
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_OVER_COUNT_EMAIL_AUTH,
              message: ERROR_MESSAGE(ERRORCODE.NET_E_OVER_COUNT_EMAIL_AUTH),
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (emailLimit) {
        // 마지막 인증이 오늘 날짜가 아니라면 초기화
        if (today > lastUpdatedAt) {
          await queryRunner.manager.update(
            EmailLimit,
            { email: email },
            {
              count: 0,
            },
          );
        } else {
          // 횟수 증가

          await queryRunner.manager.update(
            EmailLimit,
            { email: email },
            {
              count: emailLimit.count + 1,
            },
          );
        }
      } else {
        const emailLimit = new EmailLimit();
        emailLimit.email = email;
        emailLimit.count = 1;

        await queryRunner.manager.getRepository(EmailLimit).save(emailLimit);
      }

      // 이메일과 인증 코드를 데이터베이스에 저장한다.
      const authCode: number = Math.floor(Math.random() * 8999) + 1000;

      // 이메일 보내기
      const emailOptions: EmailOptions = {
        to: email,
        subject: '[moasis] 회원가입 이메일 인증',
        html: 'emailAuth',
        text: '인증 메일 입니다.',
      };

      const context = {
        authCode: authCode,
        remainTime: remainTime / 60 / 1000,
      };

      this.mailService.sendEmail(emailOptions, context);

      // 기존에 정보가 남아 있다면 삭제한다.
      await this.dataSource
        .getRepository(EmailCheck)
        .findOne({ where: { email } })
        .then(async (data) => {
          if (data) {
            await queryRunner.manager
              .getRepository(EmailCheck)
              .delete({ id: data.id });
          }
        })
        .catch((err) => {
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_DB_FAILED,
              message: err,
            },
            HttpStatus.FORBIDDEN,
          );
        });

      const emailCheck = new EmailCheck();
      emailCheck.email = email;
      emailCheck.authCode = authCode;

      await queryRunner.manager.getRepository(EmailCheck).save(emailCheck);

      setTimeout(async () => {
        await this.dataSource
          .getRepository(EmailCheck)
          .findOne({ where: { email, authCode } })
          .then(async (data) => {
            this.logger.debug({ data });
            if (data) {
              await this.emailCheckRepository.delete({ id: data.id });
            }
          })
          .catch((err) => {
            throw new HttpException(
              {
                error: ERRORCODE.NET_E_DB_FAILED,
                message: err,
              },
              HttpStatus.FORBIDDEN,
            );
          });
      }, remainTime);

      // 이메일 인증 여부 확인 후 정보가 있다면 삭제 (추후 인증번호로 인증 후 다시 저장)
      await this.dataSource
        .getRepository(EmailConfirm)
        .findOne({ where: { email } })
        .then(async (data) => {
          if (data) {
            await queryRunner.manager
              .getRepository(EmailConfirm)
              .delete({ id: data.id });
          }
        })
        .catch((err) => {
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_DB_FAILED,
              message: err,
            },
            HttpStatus.FORBIDDEN,
          );
        });

      await queryRunner.commitTransaction();

      return {
        remainTime: parseInt(process.env.MAIL_REMAIN_MINIUTE) * 60,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ error });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: error,
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 이메일 인증 번호 확인
  async confirmEmail(confirmemail: ConfirmEmailDto) {
    const email: string = String(confirmemail.email);
    const authCode: number = Number(confirmemail.authCode);
    // 이메일 인증 번호 확인
    const emailCheck = await this.emailCheckRepository.findOne({
      where: {
        email,
        authCode,
      },
    });

    if (!emailCheck) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_AUTH_EMAIL,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_AUTH_EMAIL),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 인증 완료 시 인증 번호 삭제
      await queryRunner.manager
        .getRepository(EmailCheck)
        .delete({ id: emailCheck.id });

      // 인증 완료 여부 저장
      const emailConfirm = new EmailConfirm();
      emailConfirm.email = email;
      await queryRunner.manager.getRepository(EmailConfirm).save(emailConfirm);

      // 저장 된 정보 3분 후 자동 삭제
      setTimeout(
        async () => {
          await this.dataSource
            .getRepository(EmailConfirm)
            .findOne({ where: { email } })
            .then(async (data) => {
              if (data) {
                await this.emailConfirmRepository.delete({ id: data.id });
              }
            });
        },
        60 * 3 * 1000,
      );

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ err });
    } finally {
      await queryRunner.release();
    }
  }

  // 패스워드 재설정
  async resetPassword(resetPassword: ResetPasswordDto) {
    const email = String(resetPassword.email);

    const memberAccount = await this.memberAccountRepository.findOne({
      where: {
        accountToken: email,
        providerType: PROVIDER_TYPE.ARZMETA,
      },
    });

    if (!memberAccount) {
      this.logger.error(ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER));
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const token = crypto.randomBytes(20).toString('hex'); // token 생성
    const data = new MemberPasswordAuth();

    data.token = token;
    data.memberId = memberAccount.memberId;
    data.ttl = Number(process.env.MAIL_REMAIN_MINIUTE) * 60; // ttl 값 설정 (3분)

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 이메일 검증 횟수 체크
      const isEnableSendEmail =
        await this.commonService.isResetPasswordEmailAndIdentification(
          email,
          queryRunner,
        );
      if (!isEnableSendEmail) {
        return {
          error: ERRORCODE.NET_E_OVER_COUNT_EMAIL_AUTH,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_OVER_COUNT_EMAIL_AUTH),
        };
      }

      await queryRunner.manager.getRepository(MemberPasswordAuth).save(data);

      // 이메일 발송
      const emailOptions: EmailOptions = {
        to: email,
        subject: '[a:rzmeta] 패스워드 재설정 이메일',
        html: 'passwordReset',
        text: '패스워드 재설정 이메일 입니다.',
      };

      const context = {
        url: process.env.HOMEPAGE_FRONT_URL,
        token: token,
        email: email,
        remainTime: Number(process.env.MAIL_REMAIN_MINIUTE),
      };
      this.mailService.sendEmail(emailOptions, context);

      await queryRunner.commitTransaction();
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return {
        error: ERRORCODE.NET_E_DB_FAILED,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
      };
    } finally {
      await queryRunner.release();
    }
  }

  private async ktmfNftLoginReward(queryRunner: QueryRunner, memberId: string) {
    // 지갑 보유 여부 확인
    const memberWallet = await this.dataSource
      .getRepository(MemberWalletInfo)
      .findOne({
        where: {
          memberId: memberId,
        },
      });

    if (!memberWallet) {
      // 지갑 없음
      return null;
    }

    // 토큰 보유 여부 확인
    const memberTokens = await this.dataSource
      .getRepository(KtmfNftTokenToWallet)
      .find({
        where: {
          walletAddr: memberWallet.walletAddr,
        },
      });

    if (memberTokens.length === 0) {
      // 보유 토큰 없음.
      return null;
    }

    dayjs.extend(duration);
    // 오늘 날짜
    const currentDate = dayjs().startOf('day');

    let totalMoneyCount = 0;
    // 보유한 토큰 목록을 순회 한다.
    for (const t of memberTokens) {
      //
      // 주리 지급 로그 확인 - 본인 데이터만 ( 마지막 지급이 언제인지?? 가장 최근 값만 가져오기 )
      const lastReceivedLog = await this.dataSource
        .getRepository(MemberNftRewardLog)
        .findOne({
          where: {
            memberId: memberId,
            tokenId: t.tokenId,
          },
          order: {
            createdAt: 'DESC',
          },
        });

      // 주리 지급 로그 확인 - 다른 사용자가 오늘 지급 받았는지 확인
      const otherReceivedLog = await this.dataSource
        .getRepository(MemberNftRewardLog)
        .findOne({
          where: {
            memberId: Not(memberId),
            tokenId: t.tokenId,
          },
          order: {
            createdAt: 'DESC',
          },
        });

      if (otherReceivedLog) {
        // 이전 소유자가 오늘 수령 했다면 패스!!
        const otherReceivedData = dayjs(otherReceivedLog.createdAt).startOf(
          'day',
        );
        if (currentDate.isSame(otherReceivedData)) {
          console.log('The dates are the same!');
          return null;
        }
      }

      let referenceDate = null;
      // 한번도 받은 적이 없다.
      if (!lastReceivedLog) {
        //
        // 한번도 지급 받은 적이 없다면 지갑을 연동한 날부터 오늘 까지의 일자를 계산 하여 지급 한다.
        // 지갑 연동 당일도 지급을 받아야 하기 때문에 1일을 더 제외 한다.
        //
        referenceDate = dayjs(memberWallet.createdAt)
          .startOf('day')
          .subtract(1, 'day');
      } else {
        // 가장 최근에 받은 날짜
        const lastRecieveDate = dayjs(lastReceivedLog.createdAt).startOf('day');
        const daysPassed = currentDate.diff(lastRecieveDate, 'day');

        console.log(`날짜가 바뀌었으며, ${daysPassed}일이 지났습니다.`);

        // 마지막 받은 날짜에서 1일 이상 지났음.
        if (lastRecieveDate.isBefore(currentDate)) {
          // 토큰을 획득한 일자와 비교하여 토큰 획득 일자보다
          // 마지막 재화 지급 일자가 더 이전 이라면 토큰 획득 일자로 계산한다.
          referenceDate = dayjs(lastRecieveDate).startOf('day');
          if (dayjs(memberWallet.createdAt) > dayjs(lastRecieveDate)) {
            referenceDate = dayjs(memberWallet.createdAt).startOf('day');
          }
          // ( 토큰을 획득한 일자 보다 마지막 재화 지급 일자가 더 이전 이라면 같은 토큰이 아니다. 즉, 토큰을 판매 했다가 다시 획득 한 경우  )
        }
      }

      if (referenceDate) {
        // 재화를 지급해야하는 날짜 수
        const elapsedDate = currentDate.diff(referenceDate, 'day', true);

        // 주리를 지급 해야 한다면
        // 토큰 갯수 및 토큰의 레어리티 확인
        const nftToken = await this.dataSource
          .getRepository(KtmfNftToken)
          .createQueryBuilder('k')
          .select([
            'k.tokenId as tokenId',
            'k.ratingType as ratingType',
            'ksm.moneyType as moneyType',
            'ksm.rewardCount as rewardCount',
          ])
          .innerJoin('k.KtmfPassTierRatingType', 'kptrt')
          .innerJoin('kptrt.KtmfSpecialMoney', 'ksm')
          .where('k.tokenId = :tokenId', { tokenId: t.tokenId })
          .getRawOne();

        // 총 지급 재화 개수
        totalMoneyCount += elapsedDate * nftToken.rewardCount;

        if (elapsedDate > 0) {
          // 재화 지급 로그 기록
          const log = new MemberNftRewardLog();
          log.memberId = memberId;
          log.tokenId = t.tokenId;
          log.moneyType = nftToken.moneyType;
          log.rewardCount = totalMoneyCount;

          await queryRunner.manager.getRepository(MemberNftRewardLog).save(log);
        }
      }
    }

    // 주리 지급 !!
    if (totalMoneyCount > 0) {
      const exMoney = await this.dataSource.getRepository(MemberMoney).findOne({
        where: {
          memberId: memberId,
          moneyType: MONEY_TYPE.JURI,
        },
      });

      if (exMoney) {
        await queryRunner.manager
          .getRepository(MemberMoney)
          .createQueryBuilder()
          .update(MemberMoney)
          .set({
            count: () => `count + ${totalMoneyCount}`,
          })
          .where('memberId = :memberId', { memberId })
          .execute();
      } else {
        const memberMoney = new MemberMoney();
        memberMoney.memberId = memberId;
        memberMoney.moneyType = MONEY_TYPE.JURI;
        memberMoney.count = totalMoneyCount;

        await queryRunner.manager.getRepository(MemberMoney).save(memberMoney);
      }
    }

    return totalMoneyCount;
  }

  // 사용자 존재 여부 체크
  private async invalidMember(providerType, accountToken): Promise<boolean> {
    const exAccount = await this.dataSource
      .getRepository(MemberAccount)
      .findOne({
        where: {
          providerType: providerType,
          accountToken: accountToken,
        },
      });

    this.logger.debug({ exAccount });
    // 사용자 존재 여부 확인
    if (exAccount) {
      const exMember = await this.dataSource.getRepository(Member).findOne({
        where: {
          memberId: exAccount.memberId,
        },
      });

      if (!exMember) {
        return false;
      }

      return true;
    }

    return false;
  }

  async createTestAccount() {
    for (let index = 1; index <= 50; index++) {
      const num = String(index).padStart(2, '0');

      const email = `test${num}@email.com`;

      console.log(email);

      // const emailConfirm = new EmailConfirm();
      // emailConfirm.email = email;

      // const result = await this.dataSource.getRepository(EmailConfirm).save(emailConfirm);

      // const signInfo = new SignMemberDto();
      // signInfo.accountToken = String(Encrypt(email));
      // signInfo.password = String(Encrypt('1111'));

      // const result = await this.createMember(signInfo);
      // console.log(result);
    }
  }

  // async createTestAccountEncrypt(data: any) {
  //   const email = String(Encrypt(data.email));
  //   const password = String(Encrypt(data.password));
  //   const jwtToken = String(Encrypt(data.jwtToken));
  //   const sessionId = String(Encrypt(data.sessionId));
  //   console.log(email, password, jwtToken);

  //   return { email, password, jwtToken };
  // }
}
