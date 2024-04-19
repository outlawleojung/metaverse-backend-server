import { v1 } from 'uuid';
import {
  EmailCheck,
  EmailConfirm,
  Member,
  MemberAccount,
  MemberLoginLog,
} from '@libs/entity';
import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcryptjs from 'bcryptjs';
import { ERROR_MESSAGE, ERRORCODE, PROVIDER_TYPE } from '@libs/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommonService } from '@libs/common';
import { Socket } from 'socket.io';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(MemberAccount)
    private readonly memberAccountRepository: Repository<MemberAccount>,
    @InjectRepository(EmailConfirm)
    private emailConfirmRepository: Repository<EmailConfirm>,
    @InjectRepository(MemberLoginLog)
    private memberLoginLogRepository: Repository<MemberLoginLog>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => CommonService))
    private readonly commonService: CommonService,
  ) {}

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      return 'error';
    }

    const token = splitToken[1];

    return token;
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');

    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 로그인 토큰 입니다.');
    }

    const accountToken = split[0];
    const password = split[1];

    return {
      accountToken,
      password,
    };
  }

  signToken(
    member: Pick<Member, 'memberId' | 'nickname' | 'email'>,
    isRefreshToken: boolean,
  ) {
    const payload = {
      sub: member.memberId,
      nickname: member.nickname,
      email: member.email,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: isRefreshToken
        ? parseInt(process.env.REFRESH_TOKEN_EXPIRESIN, 10)
        : parseInt(process.env.ACCESS_TOKEN_EXPIRESIN, 10),
    });
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch (e) {
      console.log(e.toString());
      throw new UnauthorizedException('토큰이 만료 됐거나 유효하지 않습니다.');
    }
  }

  /**
   * 토큰 재발급
   * @param token
   * @param isRefreshToken
   * @returns
   */
  async rotateToken(token: string, isRefreshToken: boolean) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException(
          '토큰 재발급은 Refresh 토큰으로만 가능합니다.',
        );
      }

      // 데이터베이스에 있는 토큰과 비교
      const member = await this.memberRepository.findOne({
        where: {
          memberId: decoded.sub,
        },
      });

      const validToken = await bcryptjs.compareSync(token, member.refreshToken);
      console.log('validToken: ', validToken);
      if (!validToken) {
        throw new UnauthorizedException('Refresh 토큰이 유효하지 않습니다.');
      }

      return this.signToken(
        {
          ...decoded,
        },
        isRefreshToken,
      );
    } catch (e) {
      console.log(e.toString());
      throw new UnauthorizedException('토큰이 만료 됐거나 유효하지 않습니다.');
    }
  }

  /**
   * Refresh Token 데이터베이스에 저장
   * @param token
   */
  async saveRefreshToken(token) {
    const result = this.verifyToken(token);

    // 토큰 암호화 설정
    const hashedRefreshToken = await bcryptjs.hash(token, 12);

    try {
      await this.memberRepository.update(
        { memberId: result.sub },
        { refreshToken: hashedRefreshToken },
      );
    } catch (e) {
      console.log(e.toString());
      throw new ForbiddenException('Refresh 토큰 DB 저장 실패');
    }
  }

  async loginMember(member: Pick<Member, 'memberId' | 'nickname' | 'email'>) {
    const refreshToken = this.signToken(member, true);

    await this.saveRefreshToken(refreshToken);
    await this.loginCounting(member.memberId);

    return {
      accessToken: this.signToken(member, false),
      refreshToken,
    };
  }

  async validRefreshToken(token: string) {
    const result = this.verifyToken(token);

    const member = await this.memberRepository.findOne({
      select: ['memberId', 'memberCode', 'nickname', 'email', 'refreshToken'],
      where: {
        memberId: result.sub,
      },
    });

    const validToken = await bcryptjs.compareSync(token, member.refreshToken);

    if (!validToken) {
      throw new UnauthorizedException('Refresh 토큰이 유효하지 않습니다.');
    }

    return member;
  }

  async authenticateWithEmailAndPassword(
    memberAccount: Pick<MemberAccount, 'accountToken' | 'password'>,
  ) {
    const email = memberAccount.accountToken;
    const exMember = await this.commonService.getMemberAccountByEmail(email);

    if (!exMember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const validPassword = await bcryptjs.compareSync(
      memberAccount.password,
      exMember.password,
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

    const member = await this.memberRepository.findOne({
      select: ['memberId', 'memberCode', 'nickname', 'email'],
      where: {
        memberId: exMember.memberId,
      },
    });

    return member;
  }

  async autoLogin(token: string) {
    const member = await this.validRefreshToken(token);
    return await this.loginMember(member);
  }

  async loginWithEmail(
    memberAccount: Pick<MemberAccount, 'accountToken' | 'password'>,
  ) {
    const exMember = await this.authenticateWithEmailAndPassword(memberAccount);

    return await this.loginMember(exMember);
  }

  // 자체 계정 생성
  async registerWithEmail(
    account: Pick<MemberAccount, 'accountToken' | 'password' | 'regPathType'>,
  ) {
    const accountToken = account.accountToken;

    // 이메일 중복 검증
    const exAccount = await this.memberAccountRepository.exists({
      where: {
        accountToken: accountToken,
        providerType: PROVIDER_TYPE.ARZMETA,
      },
    });

    if (exAccount) {
      this.logger.error(ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXIST_EMAIL));
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_EXIST_EMAIL,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXIST_EMAIL),
        },
        400,
      );
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
    if (!account.password) {
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
      const memberInfo = await this.commonService.commonCreateAccount(
        queryRunner,
        accountToken,
        PROVIDER_TYPE.ARZMETA,
        account.regPathType,
      );

      // 인증 된 이메일 정보 삭제
      await queryRunner.manager.delete(EmailCheck, { email: accountToken });
      await queryRunner.manager.delete(EmailConfirm, { email: accountToken });

      //패스워드 설정
      const password: string = account.password;
      const hashedPassword = await bcryptjs.hash(password, 12);

      const memberAccount = new MemberAccount();
      memberAccount.memberId = memberInfo.memberId;
      memberAccount.providerType = PROVIDER_TYPE.ARZMETA;
      memberAccount.password = hashedPassword;

      await queryRunner.manager
        .getRepository(MemberAccount)
        .save(memberAccount);

      await queryRunner.commitTransaction();

      return await this.loginMember(memberInfo);
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

  async loginCounting(memberId: string) {
    // 로그인 횟수 체크
    const newMember = new Member();
    newMember.memberId = memberId;
    newMember.loginedAt = new Date();
    newMember.deletedAt = null;

    await this.memberRepository.save(newMember);

    // 로그인 로그
    const loginLog = new MemberLoginLog();
    loginLog.memberId = memberId;
    loginLog.providerType = PROVIDER_TYPE.ARZMETA;

    await this.memberLoginLogRepository.save(loginLog);
  }

  async checkAccessTokenForSocket(client: Socket): Promise<Member> {
    let accessToken;
    if (!client.handshake.auth.accessToken) {
      accessToken = client.handshake.headers.authorization;
    } else {
      accessToken = client.handshake.auth.accessToken;
    }

    if (!accessToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    console.log('accessToken: ', accessToken);
    const result = await this.verifyToken(accessToken);

    return await this.commonService.getMemberByEmail(result.email);
  }
}
