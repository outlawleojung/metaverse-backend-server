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
import { LoginTokenService } from './../auth/login-token.service';
import { v1 } from 'uuid';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Decrypt, CommonService, Encrypt, JwtService } from '@libs/common';
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
  ProviderType,
  MemberLoginLog,
  SessionInfo,
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
import { SignUpResponseDto } from './dto/response/signup.response.dto';
import { LoginAuthResponseDto } from './dto/response/login.auth.response.dto';
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
    private loginTokenService: LoginTokenService,
    private commonService: CommonService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(AccountService.name);

  // 자체 계정 생성
  async createMember(memberData: SignMemberDto) {
    const accountToken = Decrypt(memberData.accountToken) as string;
    // 이메일 중복 검증
    const exAccount = await this.memberAccountRepository.findOne({
      where: {
        accountToken: accountToken,
        providerType: PROVIDER_TYPE.ARZMETA,
      },
    });

    if (exAccount) {
      this.logger.error(ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXIST_EMAIL));
      throw new HttpException({ error: 254, message: '사용중인 이메일' }, 400);
    }

    // 이메일 인증 여부 확인
    const emailConfirm = await this.emailConfirmRepository.findOne({
      where: {
        email: accountToken,
      },
    });

    if (!emailConfirm) {
      this.logger.error(ERROR_MESSAGE(ERRORCODE.NET_E_NOT_AUTH_EMAIL));
      throw new ForbiddenException({
        error: ERRORCODE.NET_E_NOT_AUTH_EMAIL,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_AUTH_EMAIL),
      });
    }

    // 패스워드 없음
    if (!memberData.password) {
      this.logger.error(ERROR_MESSAGE(ERRORCODE.NET_E_EMPTY_PASSWORD));
      throw new ForbiddenException({
        error: ERRORCODE.NET_E_EMPTY_PASSWORD,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_EMPTY_PASSWORD),
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const memberInfo = await this.commonCreateAccount(
        queryRunner,
        accountToken,
        PROVIDER_TYPE.ARZMETA,
        memberData.regPathType,
      );

      // 인증 된 이메일 정보 삭제
      await queryRunner.manager.delete(EmailCheck, { email: accountToken });
      await queryRunner.manager.delete(EmailConfirm, { email: accountToken });

      //패스워드 설정
      // 패스워드 해싱
      const password: string = String(Decrypt(memberData.password));
      const hashedPassword = await bcryptjs.hash(password, 12);

      const memberAccount = new MemberAccount();
      memberAccount.memberId = memberInfo.memberId;
      memberAccount.providerType = PROVIDER_TYPE.ARZMETA;
      memberAccount.password = hashedPassword;

      await queryRunner.manager
        .getRepository(MemberAccount)
        .save(memberAccount);

      await queryRunner.commitTransaction();

      const m = await this.memberRepository.findOne({
        where: { memberId: memberInfo.memberId },
      });
      // 로그인 토큰 발급
      const loginToken = await this.loginTokenService.signToken(
        memberInfo.memberId,
        hashedPassword,
        m.passwdUpdatedAt,
      );

      memberInfo.loginToken = loginToken;
      memberInfo.error = ERRORCODE.NET_E_SUCCESS;
      memberInfo.errorMessage = ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS);
      return memberInfo;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ err });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 아즈메타 로그인
  async arzmetaLogin(memberData: ArzmetaLogInMemberDto) {
    const accountToken = String(Decrypt(memberData.accountToken));

    if (!(await this.invalidMember(PROVIDER_TYPE.ARZMETA, accountToken))) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const exAccount = await this.dataSource
      .getRepository(MemberAccount)
      .findOne({
        where: {
          accountToken: accountToken,
          providerType: PROVIDER_TYPE.ARZMETA,
        },
      });

    this.logger.debug({ exAccount });

    const password = String(Decrypt(memberData.password));
    const validPassword = await bcryptjs.compareSync(
      password,
      exAccount.password!,
    );

    if (!validPassword) {
      this.logger.error(ERROR_MESSAGE(ERRORCODE.NET_E_NOT_MATCH_PASSWORD));
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_MATCH_PASSWORD,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_MATCH_PASSWORD),
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newMember = new Member();
      newMember.memberId = exAccount.memberId;
      newMember.providerType = PROVIDER_TYPE.ARZMETA;

      await queryRunner.manager.getRepository(Member).save(newMember);
      await queryRunner.commitTransaction();

      const member = await this.dataSource.getRepository(Member).findOne({
        where: {
          memberId: exAccount.memberId,
        },
      });

      this.logger.debug({ member });

      const memberInfo = await this.login(member, exAccount);
      // 로그인 토큰 발급
      const loginToken = await this.loginTokenService.signToken(
        member.memberId,
        exAccount.password,
        member.passwdUpdatedAt,
      );
      memberInfo.loginToken = loginToken;
      return {
        memberInfo,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 소셜 로그인
  async socialLogin(memberData: LogInMemberDto) {
    const accountToken = String(Decrypt(memberData.accountToken));

    if (!(await this.invalidMember(memberData.providerType, accountToken))) {
      // 계정 생성
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await this.commonCreateAccount(
          queryRunner,
          accountToken,
          memberData.providerType,
          memberData.regPathType,
        );
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    } else {
      const exAccount = await this.memberAccountRepository.findOne({
        where: {
          providerType: memberData.providerType,
          accountToken: accountToken,
        },
      });

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const member = new Member();
        member.memberId = exAccount.memberId;
        member.providerType = memberData.providerType;

        await queryRunner.manager.getRepository(Member).save(member);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }

    const exAccount = await this.memberAccountRepository.findOne({
      where: {
        providerType: memberData.providerType,
        accountToken: accountToken,
      },
    });

    return {
      memberId: exAccount.memberId,
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 자동 로그인
  async autoLogin(autoLogin: AutoLoginDto) {
    const memberId = String(Decrypt(autoLogin.memberId));

    // 사용자 존재 여부 확인
    const exMember = await this.memberRepository.findOne({
      where: { memberId: memberId },
    });

    console.log(exMember);

    if (!exMember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 이미 존재 할 경우 로그인 처리
    const memberAccount = await this.memberAccountRepository.findOne({
      where: {
        memberId: memberId,
        providerType: autoLogin.providerType,
      },
    });

    if (!memberAccount) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const memberInfo = await this.login(exMember, memberAccount);
    if (exMember.providerType === PROVIDER_TYPE.ARZMETA)
      memberInfo.email = memberAccount.accountToken;
    else memberInfo.email = null;

    return {
      memberInfo,
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 계정 연동
  async linkedAccount(data: LinkedAccountDto) {
    console.log('linkedAccount Data: ', data);
    const accountToken = String(Decrypt(data.accountToken));

    if (
      accountToken === '' ||
      accountToken === undefined ||
      accountToken === 'undefined' ||
      !accountToken ||
      accountToken.trim().length === 0
    ) {
      throw new ForbiddenException({
        error: ERRORCODE.NET_E_NOT_EXIST_USER,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
      });
    }

    // 아즈메타 계정은 이메일 인증 필요
    if (data.providerType === PROVIDER_TYPE.ARZMETA) {
      const emailConfirm = await this.emailConfirmRepository.findOne({
        where: {
          email: accountToken,
        },
      });

      if (!emailConfirm) {
        this.logger.error(ERROR_MESSAGE(ERRORCODE.NET_E_NOT_AUTH_EMAIL));
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_NOT_AUTH_EMAIL,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_AUTH_EMAIL),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // 해당 계정에 연동 할 회원 유형이 이미 연동 되어 있는지 확인
    const memberAccount = await this.memberAccountRepository.findOne({
      where: {
        memberId: data.memberId,
        providerType: data.providerType,
      },
    });

    if (memberAccount) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_PROVIDER_TYPELINKED_ACCOUNT,
          message: ERROR_MESSAGE(
            ERRORCODE.NET_E_ALREADY_PROVIDER_TYPELINKED_ACCOUNT,
          ),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 소셜 계정일 경우 기존에 가입된 계정인지 확인
    if (data.providerType !== PROVIDER_TYPE.ARZMETA) {
      // 기존에 연동된 계정이 있는지 확인
      const exMemberAccount = await this.memberAccountRepository.findOne({
        where: {
          providerType: data.providerType,
          accountToken: accountToken,
        },
      });

      if (exMemberAccount) {
        // 기존에 연동 되어 있는 정보 조회
        const exMember = await this.memberRepository.findOne({
          where: {
            memberId: exMemberAccount.memberId,
          },
        });

        const socialLoginInfo = await this.memberAccountRepository.find({
          select: { providerType: true, accountToken: true },
          where: {
            memberId: exMember.memberId,
          },
        });

        const avatarInfos = await this.commonService.getMemberAvatarInfo(
          exMember.memberCode,
        );

        return {
          error: ERRORCODE.NET_E_ALREADY_LINKED_OTHER_ACCOUNT,
          errorMessage: ERROR_MESSAGE(
            ERRORCODE.NET_E_ALREADY_LINKED_OTHER_ACCOUNT,
          ),
          memberInfo: {
            memberId: exMember.memberId,
            nickname: exMember.nickname,
            stateMessage: exMember.stateMessage,
            socialLoginInfo,
            memberCode: exMember.memberCode,
            avatarInfos: avatarInfos,
          },
        };
      }
    }

    // 토큰 중복 확인
    const duplicateAccount = await this.memberAccountRepository.findOne({
      where: {
        accountToken: accountToken,
      },
    });

    if (duplicateAccount) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_PROVIDER_TYPELINKED_ACCOUNT,
          message: ERROR_MESSAGE(
            ERRORCODE.NET_E_ALREADY_PROVIDER_TYPELINKED_ACCOUNT,
          ),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newAccount = new MemberAccount();
      newAccount.accountToken = accountToken;
      newAccount.providerType = data.providerType;
      newAccount.memberId = data.memberId;
      if (data.password) {
        const hashedpassword = await bcryptjs.hash(
          String(Decrypt(data.password)),
          12,
        );
        newAccount.password = hashedpassword;
      }

      await queryRunner.manager.getRepository(MemberAccount).save(newAccount);

      if (data.providerType === PROVIDER_TYPE.ARZMETA) {
        const m = new Member();
        m.email = accountToken;
        m.memberId = data.memberId;

        await queryRunner.manager.getRepository(Member).save(m);
      }

      await queryRunner.commitTransaction();

      const socialLoginInfo = await this.memberAccountRepository.find({
        select: { providerType: true, accountToken: true },
        where: {
          memberId: data.memberId,
        },
      });

      return {
        socialLoginInfo,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ error });

      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 아즈메타 계정 여부 확인
  async checkArzmetaAccount(data: ArzmetaLogInMemberDto) {
    const accountToken = String(Decrypt(data.accountToken));

    const exAccount = await this.dataSource
      .getRepository(MemberAccount)
      .findOne({
        where: {
          accountToken: accountToken,
          providerType: PROVIDER_TYPE.ARZMETA,
        },
      });

    if (!exAccount) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    this.logger.debug({ exAccount });

    const password = String(Decrypt(data.password));
    const validPassword = await bcryptjs.compareSync(
      password,
      exAccount.password!,
    );

    if (!validPassword) {
      this.logger.error(ERROR_MESSAGE(ERRORCODE.NET_E_NOT_MATCH_PASSWORD));
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_MATCH_PASSWORD,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_MATCH_PASSWORD),
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 계정 연동 해제
  async releaseLinkedAccount(memberId, providerType) {
    const member = await this.memberRepository.findOne({
      where: {
        memberId: memberId,
      },
    });

    // 현재 로그인 된 유형일 경우 해제 불가
    if (member.providerType === providerType) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_RELEASE_LINKED_ACCOUNT,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_RELEASE_LINKED_ACCOUNT),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const memberAccount = await this.memberAccountRepository.count({
      where: {
        memberId: memberId,
      },
    });

    if (memberAccount <= 1) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_RELEASE_LINKED_ACCOUNT,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_RELEASE_LINKED_ACCOUNT),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(MemberAccount, {
        memberId: memberId,
        providerType: providerType,
      });

      await queryRunner.commitTransaction();

      const socialLoginInfo = await this.memberAccountRepository.find({
        select: { providerType: true, accountToken: true },
        where: {
          memberId: memberId,
        },
      });

      return {
        socialLoginInfo,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ error });

      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 세션 생성
  async CreateSession(
    _memberId: string,
    _sessionId: string,
    queryRunner: QueryRunner,
  ) {
    const memberSession = new SessionInfo();
    memberSession.memberId = _memberId;
    memberSession.sessionId = _sessionId;

    await queryRunner.manager.getRepository(SessionInfo).save(memberSession);
  }

  async getDatabase() {
    const providerType = await this.dataSource
      .getRepository(ProviderType)
      .find();

    return { providerType };
  }

  // 로그인 유효성 검사
  async loginAuth(loginAuthDto: LoginAuthDto) {
    try {
      const data: any = await this.loginTokenService.checkLoginToken(
        loginAuthDto.loginToken,
      );
      this.logger.debug({ data });
      const pwdt = new Date(dayjs(data.pwdt).format('YYYY-MM-DD HH:mm:ss'));
      const exMember = await this.memberRepository.findOne({
        where: {
          memberId: data.idx,
          passwdUpdatedAt: pwdt,
        },
      });

      if (exMember) {
        const socialAccount = await this.memberAccountRepository.findOne({
          where: {
            memberId: data.idx,
            password: data.pw,
            providerType: PROVIDER_TYPE.ARZMETA,
          },
        });

        if (exMember && socialAccount) {
          const response = new LoginAuthResponseDto();
          response.memberId = exMember.memberId;
          response.error = ERRORCODE.NET_E_SUCCESS;
          response.errorMessage = ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS);

          return response;
        }
      }
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_INVALID_TOKEN,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_INVALID_TOKEN),
        },
        HttpStatus.FORBIDDEN,
      );
    } catch (error) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_INVALID_TOKEN,
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // 소셜 계정 가입
  async createSocial(token: string, providerType: number) {
    const accountToken = String(Decrypt(token));
    console.log(`accountToken : ${accountToken}`);

    // 계정 중복 검증
    const exAccount = await this.memberAccountRepository.findOne({
      where: {
        accountToken: accountToken,
        providerType: providerType,
      },
    });

    if (exAccount) {
      this.logger.error(ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXIST_EMAIL));
      throw new HttpException({ error: 254, message: '이미 가입된 계정' }, 400);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 유니크 아이디 (memberId) 발급
      const memberId = v1();

      const memberCode = await this.commonService.GnenerateMemberCode();

      const member = new Member();
      member.memberId = memberId;
      member.memberCode = memberCode;

      await queryRunner.manager.getRepository(Member).save(member);

      // 기본 인벤토리 설정 ( 인테리어)
      await this.commonService.CreateMemberInteriorInventoryInit(
        member.memberId,
        queryRunner,
      );

      // 기본 마이룸 설정
      await this.commonService.CreateMemberMyRoomInit(
        member.memberId,
        queryRunner,
      );

      // 기본 아바타 파츠 설정
      await this.commonService.CreateMemberAvatarPartsInventoryInit(
        member.memberId,
        queryRunner,
      );

      // 계정 생성
      const memberAccount = new MemberAccount();
      memberAccount.memberId = member.memberId;
      memberAccount.providerType = providerType;
      memberAccount.accountToken = accountToken;

      await queryRunner.manager
        .getRepository(MemberAccount)
        .save(memberAccount);

      await queryRunner.commitTransaction();

      return {
        memberId: member.memberId,
        providerType: providerType,
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ err });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

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

  // 공용 계정 생성 모듈
  async commonCreateAccount(
    queryRunner: QueryRunner,
    accountToken,
    providerType,
    regPathType,
  ) {
    this.logger.debug('providerType: ', providerType);
    // 유니크 아이디 (memberId) 발급
    const memberId = v1();

    const memberCode = await this.commonService.GnenerateMemberCode();

    const member = new Member();
    member.memberId = memberId;
    member.memberCode = memberCode;
    member.firstProviderType = providerType;
    member.regPathType = regPathType;

    if (providerType === PROVIDER_TYPE.ARZMETA) {
      member.email = accountToken;
    }

    await queryRunner.manager.getRepository(Member).save(member);

    // 기본 인벤토리 설정 ( 인테리어)
    await this.commonService.CreateMemberInteriorInventoryInit(
      member.memberId,
      queryRunner,
    );

    // 기본 마이룸 설정
    await this.commonService.CreateMemberMyRoomInit(
      member.memberId,
      queryRunner,
    );

    // 기본 아바타 파츠 설정
    await this.commonService.CreateMemberAvatarPartsInventoryInit(
      member.memberId,
      queryRunner,
    );

    // 계정 생성
    const memberAccount = new MemberAccount();
    memberAccount.memberId = member.memberId;
    memberAccount.providerType = providerType;
    memberAccount.accountToken = accountToken;

    await queryRunner.manager.getRepository(MemberAccount).save(memberAccount);

    const responseData = new SignUpResponseDto();
    responseData.memberId = member.memberId;

    return responseData;
  }

  // 공용 로그인
  private async login(member: Member, memberAccount: MemberAccount) {
    // 사용자 존재 여부 확인
    let sessionId = null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // KTMF NFT 로그인 보상
      const rewardCount = await this.ktmfNftLoginReward(
        queryRunner,
        member.memberId,
      );
      const moneyReward = {
        moneyType: MONEY_TYPE.JURI,
        rewardCount: rewardCount ?? 0,
      };

      // 로그인 횟수 체크
      const newMember = new Member();
      newMember.memberId = member.memberId;
      newMember.loginedAt = new Date();
      newMember.deletedAt = null;
      await queryRunner.manager.getRepository(Member).save(newMember);

      // 세션 아이디 생성 및 저장
      sessionId = v1();
      await this.CreateSession(member.memberId, sessionId, queryRunner);

      // 로그인 보상 처리

      // 로그인 로그
      const loginLog = new MemberLoginLog();
      loginLog.memberId = member.memberId;
      loginLog.providerType = PROVIDER_TYPE.ARZMETA;

      await queryRunner.manager
        .getRepository(MemberLoginLog)
        .save(loginLog, { reload: false });

      // 토큰 발급
      const jwtToken = await this.jwtService.signToken(member);

      await queryRunner.commitTransaction();

      console.log(member);
      const memberInfo: any = {
        memberId: member.memberId,
        memberCode: member.memberCode,
        providerType: memberAccount.providerType,
        email: member.email,
        jwtAccessToken: jwtToken,
        sessionId: sessionId,
        nickname: member.nickname,
        stateMessage: member.stateMessage,
        officeGradeType: member.officeGradeType,
        myRoomStateType: member.myRoomStateType,
        moneyReward,
      };

      return memberInfo;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
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

  // Test Date
  async testDate() {
    // 오늘 날짜
    const currentDate = dayjs().startOf('day');
    dayjs.extend(duration);

    const prevDate = new Date('2023-09-20 15:34:12');
    const lastRecieveDate = dayjs(prevDate).startOf('day');

    console.log(
      'prev date: ',
      dayjs(lastRecieveDate).format('YYYY-MM-DD HH:mm:ss'),
    );
    console.log('today : ', dayjs(currentDate).format('YYYY-MM-DD HH:mm:ss'));
    const difference = dayjs.duration(currentDate.diff(lastRecieveDate));

    const daysPassed = currentDate.diff(lastRecieveDate, 'day');
    console.log(`날짜가 바뀌었으며, ${daysPassed}일이 지났습니다.`);
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

      const signInfo = new SignMemberDto();
      signInfo.accountToken = String(Encrypt(email));
      signInfo.password = String(Encrypt('1111'));

      const result = await this.createMember(signInfo);
      console.log(result);
    }
  }

  async createTestAccountEncrypt(data: any) {
    const email = String(Encrypt(data.email));
    const password = String(Encrypt(data.password));
    const jwtToken = String(Encrypt(data.jwtToken));
    const sessionId = String(Encrypt(data.sessionId));
    console.log(email, password, jwtToken);

    return { email, password, jwtToken };
  }
}
