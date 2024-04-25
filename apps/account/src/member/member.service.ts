import { UpdateMyProfileDto } from './dto/request/update.my.profile.dto';
import { CommonService } from '@libs/common';
import {
  PROVIDER_TYPE,
  ERRORCODE,
  ERROR_MESSAGE,
  FUNCTION_TABLE,
} from '@libs/constants';
import {
  AvatarPartsType,
  AvatarPreset,
  BannerReservation,
  BusinessCardTemplate,
  CSAFEventInfo,
  EmailConfirm,
  FunctionTable,
  Member,
  MemberAccount,
  MemberAdContents,
  MemberAvatarInfo,
  MemberBusinessCardInfo,
  MemberDefaultCardInfo,
  MemberLicenseInfo,
  MemberNicknameLog,
  NoticeInfo,
  NoticeType,
  ScreenReservation,
  MemberRepository,
  MemberAccountRepository,
  MemberBusinessCardInfoRepository,
  MemberAvatarInfoRepository,
  MemberDefaultCardInfoRepository,
} from '@libs/entity';
import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import {
  DataSource,
  LessThan,
  MoreThan,
  QueryRunner,
  Repository,
} from 'typeorm';
import { SetAvatar } from './dto/request/set.avatar.dto';
import { SetAvatarPresetDto } from './dto/request/set.avatar.preset.dto';
import { CheckNickNameDto } from './dto/request/check.nickname.dto';
import { UpdateEmailDto } from './dto/request/update.email.dto';
import { ChangePasswordDto } from './dto/request/changepassword.dto';
import {
  CreateCardInfo,
  DeleteCardInfo,
  UpdateCardInfo,
  UpdateMyCardDto,
} from './dto/request/update.my.card.dto';
import { SetDefaultCardInfoDto } from './dto/request/set.default.card.info.dto';
import { CheckWidhDrawalDto } from './dto/request/check.withdrawal.dto';

@Injectable()
export class MemberService {
  private readonly logger = new Logger(MemberService.name);
  constructor(
    private memberRepository: MemberRepository,
    private memberAccountRepository: MemberAccountRepository,
    private memberBusinessCardInfoRepository: MemberBusinessCardInfoRepository,
    private memberDefaultCardInfoRepository: MemberDefaultCardInfoRepository,
    @InjectRepository(AvatarPartsType)
    private avatarPartsTypeRepository: Repository<AvatarPartsType>,
    // @InjectRepository(MemberAvatarInfo)
    // private memberAvatarInfoRepository: Repository<MemberAvatarInfo>,
    private memberAvatarInfoRepository: MemberAvatarInfoRepository,
    @InjectRepository(EmailConfirm)
    private emailConfirmRepository: Repository<EmailConfirm>,
    @InjectRepository(AvatarPreset)
    private avatarPresetRepository: Repository<AvatarPreset>,
    private commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  // 탈퇴 진행 여부 체크
  async checkWithdrawalProcess(data: CheckWidhDrawalDto) {
    const accountToken = data.accountToken;
    const memberAccount =
      await this.memberAccountRepository.findByAccountTokenAndProviderType(
        data.providerType,
        accountToken,
      );

    if (!memberAccount) {
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    }

    if (data.providerType === PROVIDER_TYPE.ARZMETA) {
      const password = data.password;
      const validPassword = await bcrypt.compareSync(
        password,
        memberAccount.password!,
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
    }

    const member = await this.memberRepository.findByMemberId(
      memberAccount.memberId,
    );

    if (member && member.deletedAt) {
      return {
        deltedAt: member.deletedAt,
        error: ERRORCODE.NET_E_IS_WITHDRAWAL_MEMBER,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_IS_WITHDRAWAL_MEMBER),
      };
    }

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 닉네임 중복 체크
  async checkNickname(checkNickname: CheckNickNameDto) {
    const exists = await this.memberRepository.checkIfNicknameExists(
      checkNickname.nickname,
    );

    if (exists) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_EXIST_NICKNAME,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXIST_NICKNAME),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 프로필 업데이트
  async updateMyProfile(
    memberId: string,
    data: UpdateMyProfileDto,
    queryRunner: QueryRunner,
  ) {
    // 사용자 존재 여부 확인
    const exMember = await this.memberRepository.findByMemberId(memberId);
    if (!exMember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (data.nickname) {
      // 현재 닉네임과 비교
      if (exMember.nickname !== data.nickname) {
        // 닉네임 중복 체크
        if (data.nickname) {
          const exists = await this.memberRepository.checkIfNicknameExists(
            data.nickname,
          );
          if (exists) {
            throw new HttpException(
              {
                error: ERRORCODE.NET_E_ALREADY_EXIST_NICKNAME,
                message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXIST_NICKNAME),
              },
              HttpStatus.FORBIDDEN,
            );
          }
        }
      }
    }

    const newMember = new Member();
    newMember.id = memberId;
    newMember.nickname = data.nickname;
    newMember.stateMessage = data.stateMessage;

    await this.memberRepository.updateMember(newMember, queryRunner);
  }

  async updateNicknameLog(
    memberId: string,
    nickname: string,
    queryRunner: QueryRunner,
  ) {
    if (nickname) {
      const nicknameLog = new MemberNicknameLog();
      nicknameLog.memberId = memberId;
      nicknameLog.nickname = nickname;
      await queryRunner.manager
        .getRepository(MemberNicknameLog)
        .save(nicknameLog);
    }
  }

  // 내 명함 업데이트
  async updateMyCardInfo(
    memberId: string,
    data: UpdateMyCardDto,
    queryRunner: QueryRunner,
  ) {
    // 사용자 존재 여부 확인
    const exMember = await this.memberRepository.findByMemberId(memberId);
    if (!exMember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 기본 명함 설정 갯수
    const funcTable = await this.dataSource
      .getRepository(FunctionTable)
      .findOne({
        where: {
          id: FUNCTION_TABLE.BUSINISS_CARD_DEFAULT_COUNT,
        },
      });

    // 현재 명함 갯수
    const bizCardCount = await this.dataSource
      .getRepository(MemberBusinessCardInfo)
      .count({
        where: {
          memberId,
        },
      });

    if (data.createCardInfos && data.createCardInfos.length > 0) {
      // 삭제 할 명함이 있다면, 삭제 할 명함 갯수는 제외
      let deleteCount = 0;
      if (data.deleteCardInfos) {
        deleteCount = data.deleteCardInfos.length;
      }

      if (
        bizCardCount + (data.createCardInfos.length - deleteCount) >
        funcTable.value
      ) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_MAX_OVER_BUSINESS_CARD,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_MAX_OVER_BUSINESS_CARD),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updateCardInfos: UpdateCardInfo[] = [];
    const createCardInfos: CreateCardInfo[] = [];
    const deleteCardInfos: DeleteCardInfo[] = [];

    // 비즈니스 명함 리스트 업데이트
    if (data.updateCardInfos && data.updateCardInfos.length > 0) {
      for (const udCard of data.updateCardInfos) {
        const cardTmplt = await this.dataSource
          .getRepository(BusinessCardTemplate)
          .findOne({
            where: {
              id: udCard.templateId,
            },
          });

        if (!cardTmplt) {
          throw new HttpException({ error: '에러' }, HttpStatus.FORBIDDEN);
        }

        const newCard = new UpdateCardInfo();
        newCard.memberId = memberId;
        newCard.num = udCard.num;
        newCard.templateId = udCard.templateId;

        if (cardTmplt.nameField) newCard.name = udCard.name;
        if (cardTmplt.phoneField) newCard.phone = udCard.phone;
        if (cardTmplt.emailField) newCard.email = udCard.email;
        if (cardTmplt.faxField) newCard.fax = udCard.fax;
        if (cardTmplt.addrField) newCard.addr = udCard.addr;
        if (cardTmplt.jobField) newCard.job = udCard.job;
        if (cardTmplt.positionField) newCard.position = udCard.position;
        if (cardTmplt.introField) newCard.intro = udCard.intro;

        updateCardInfos.push(newCard);
      }
    }

    // 비즈니스 명함 리스트 생성
    if (data.createCardInfos && data.createCardInfos.length > 0) {
      const result = await this.dataSource
        .getRepository(MemberBusinessCardInfo)
        .createQueryBuilder('b')
        .select('MAX(b.num)', 'num')
        .where('b.memberId = :memberId', { memberId })
        .getRawOne();

      let num = result.num | 0;

      for (const udCard of data.createCardInfos) {
        const cardTmplt = await this.dataSource
          .getRepository(BusinessCardTemplate)
          .findOne({
            where: {
              id: udCard.templateId,
            },
          });

        if (!cardTmplt) {
          throw new HttpException({ error: '에러' }, HttpStatus.FORBIDDEN);
        }

        num++;
        const newCard = new CreateCardInfo();
        newCard.memberId = memberId;
        newCard.templateId = cardTmplt.id;
        newCard.num = num;

        if (cardTmplt.nameField) newCard.name = udCard.name;
        if (cardTmplt.phoneField) newCard.phone = udCard.phone;
        if (cardTmplt.emailField) newCard.email = udCard.email;
        if (cardTmplt.faxField) newCard.fax = udCard.fax;
        if (cardTmplt.addrField) newCard.addr = udCard.addr;
        if (cardTmplt.jobField) newCard.job = udCard.job;
        if (cardTmplt.positionField) newCard.position = udCard.position;
        if (cardTmplt.introField) newCard.intro = udCard.intro;

        createCardInfos.push(newCard);
      }
    }

    // 비즈니스 명함 삭제

    if (data.deleteCardInfos && data.deleteCardInfos.length > 0) {
      for (const udCard of data.deleteCardInfos) {
        const delCard = new UpdateCardInfo();
        delCard.memberId = memberId;
        delCard.templateId = udCard.templateId;
        delCard.num = udCard.num;

        deleteCardInfos.push(delCard);
      }
    }

    // 새로 생성 하기
    for (const card of createCardInfos) {
      await this.memberBusinessCardInfoRepository.create(card, queryRunner);
    }

    // 갱신 하기
    for (const card of updateCardInfos) {
      await this.memberBusinessCardInfoRepository.update(card, queryRunner);
    }

    // 삭제 하기
    for (const card of deleteCardInfos) {
      console.log('delete');
      const data = card as MemberBusinessCardInfo;
      await this.memberBusinessCardInfoRepository.delete(data, queryRunner);
    }
  }

  async getBusinessCardList(memberId: string, queryRunner?: QueryRunner) {
    return await this.memberBusinessCardInfoRepository.findAllByMemberId(
      memberId,
      queryRunner,
    );
  }
  // 아바타 파츠 설정
  async setAvatar(
    memberId: string,
    avatarInfo: SetAvatar,
    queryRunner: QueryRunner,
  ) {
    // 사용자 존재 여부 확인
    const exMember = await this.memberRepository.findByMemberId(memberId);

    if (!exMember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const avatarPartsTypes = await this.avatarPartsTypeRepository.find();

    for (const partsType of avatarPartsTypes) {
      const itemId: number = Number(avatarInfo.avatarInfos[partsType.type]);
      this.logger.debug('itemId :', itemId);

      const memberAvatarInfo =
        await this.memberAvatarInfoRepository.findByMemberIdAndPartsType(
          memberId,
          partsType.type,
        );

      if (!itemId) {
        if (memberAvatarInfo) {
          // 삭제
          await this.memberAvatarInfoRepository.deleteByMemberIdAndParsType(
            memberId,
            partsType.type,
            queryRunner,
          );
        }
      } else {
        const memberAvatar = new MemberAvatarInfo();
        memberAvatar.memberId = memberId;
        memberAvatar.avatarPartsType = partsType.type;
        memberAvatar.itemId = itemId;

        await this.memberAvatarInfoRepository.create(memberAvatar, queryRunner);
      }
    }
  }

  async updateEmail(
    memberId: string,
    data: UpdateEmailDto,
    queryRunner: QueryRunner,
  ) {
    const email = data.email;
    //이메일 인증 여부 확인
    const emailConfirm = await this.emailConfirmRepository.findOne({
      where: {
        email,
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

    const newMemberAccount = new MemberAccount();
    newMemberAccount.memberId = memberId;
    newMemberAccount.providerType = PROVIDER_TYPE.ARZMETA;
    newMemberAccount.accountToken = email;

    await this.memberAccountRepository.updateMemberAccount(
      newMemberAccount,
      queryRunner,
    );

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 회원 탈퇴
  async withdrawal(memberId: string, queryRunner: QueryRunner) {
    // 사용자 존재 여부 확인
    const exMember = await this.memberRepository.findByMemberId(memberId);

    if (!exMember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    await this.memberRepository.softDelete(memberId, queryRunner);

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 탈퇴 신청 계정 확인 후 삭제
  async checkWithdrawal(queryRunner: QueryRunner) {
    const members = await this.memberRepository.findAllForDeleteMembers();

    const now = new Date(); // 현재 날짜 및 시간
    this.logger.log('현재 : ', now);
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1)); // 한달 전
    this.logger.log('한달 전 : ', oneMonthAgo);

    for (const member of members) {
      if (new Date(member.deletedAt) <= new Date(oneMonthAgo)) {
        await this.memberRepository.delete(member.id, queryRunner);
      }
    }

    return true;
  }

  // 아바타 프리셋 세팅
  async setAvatarPreset(
    memberId: string,
    avatarInfo: SetAvatarPresetDto,
    queryRunner: QueryRunner,
  ) {
    const stateMessage = avatarInfo.stateMessage;
    const nickname = avatarInfo.nickname;

    // 사용자 존재 여부 확인
    const exMember = await this.memberRepository.findByMemberId(memberId);

    if (!exMember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 현재 닉네임과 비교
    if (exMember.nickname !== nickname) {
      // 닉네임 중복 체크
      if (exMember.nickname) {
        const exists =
          await this.memberRepository.checkIfNicknameExists(nickname);

        if (exists) {
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_ALREADY_EXIST_NICKNAME,
              message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXIST_NICKNAME),
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    const avatarPreset = await this.avatarPresetRepository.find({
      where: {
        presetType: avatarInfo.presetType,
      },
    });

    this.logger.debug({ avatarPreset });

    // 프리셋 유효성 체크
    if (!avatarPreset || avatarPreset.length <= 0) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    for (let index = 0; index < avatarPreset.length; index++) {
      const preset = avatarPreset[index];
      this.logger.debug({ preset });

      const memberAvatar = new MemberAvatarInfo();
      memberAvatar.memberId = memberId;
      memberAvatar.itemId = preset.itemId;
      memberAvatar.avatarPartsType = preset.partsType;

      await this.memberAvatarInfoRepository.create(memberAvatar, queryRunner);
    }

    // 닉네임, 상태메시지 업데이트
    const mac = new Member();
    mac.id = memberId;
    mac.nickname = nickname;
    mac.stateMessage = stateMessage;

    await this.memberRepository.updateMember(mac, queryRunner);
  }

  // 앱 정보 조회
  async getAppInfo() {
    // 컨텐츠 온오프 정보
    const onfContentsInfo = await this.commonService.getOnfContentsInfo();

    const noticeInfo = await this.getNotice();

    const bannerInfo = await this.dataSource
      .getRepository(BannerReservation)
      .createQueryBuilder('br')
      .select([
        'br.bannerId as bannerId',
        'br.uploadType as uploadType',
        'br.contents as contents',
      ])
      .where('br.startedAt <= NOW() and br.endedAt >= NOW()')
      .getRawMany();

    const screenInfo = await this.dataSource
      .getRepository(ScreenReservation)
      .createQueryBuilder('sr')
      .select([
        'sr.screenId as screenId',
        'sr.screenContentType as screenContentType',
        'sr.contents as contents',
      ])
      .where('sr.startedAt <= NOW() and sr.endedAt >= NOW()')
      .getRawMany();

    // 현재 진행 중인 행사 조회
    const csafEventInfo = await this.dataSource
      .getRepository(CSAFEventInfo)
      .findOne({
        select: ['id', 'name', 'startedAt', 'endedAt', 'eventSpaceType'],
        where: {
          startedAt: LessThan(new Date()),
          endedAt: MoreThan(new Date()),
        },
      });

    return {
      onfContentsInfo: onfContentsInfo,
      bannerInfo: bannerInfo,
      screenInfo: screenInfo,
      csafEventInfo: csafEventInfo,
      noticeInfo: noticeInfo,
    };
  }

  async getMoneyInfo(memberId: string) {
    const moneyInfos = await this.commonService.getMoneyInfo(memberId);

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errmrMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      moneyInfos,
    };
  }

  // 회원 정보 조회
  async getMemberInfo(memberId: string) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@ getMemberInfo.memberId :', memberId);
    // 사용자 존재 여부 확인
    const exMember = await this.memberRepository.findByMemberId(memberId);

    if (!exMember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const membmerInfo = await this.commonService.getMemberInfo(memberId);

    // 비지니스 명함 정보
    const businessCardInfos =
      await this.commonService.getBusinessCardList(memberId);

    // 기본 명함 정보
    const defaultCardInfo =
      await this.commonService.getDefaultCardInfo(memberId);

    // 아바타 정보
    const avatarInfos = await this.commonService.getAvatarInfo(exMember.id);

    // 마이룸 정보
    const myRoomList = await this.commonService.getMyRoomInfo(memberId);

    // 마이룸 액자 정보
    const myRoomFrameImages =
      await this.commonService.getMyRoomFrameImages(memberId);

    // 가구 인벤 정보
    const interiorItemInvens =
      await this.commonService.getInteriorItemInven(memberId);

    // 아바타 인벤 정보
    const avatarPartsInvens =
      await this.commonService.getAvatarPartsItemInven(memberId);

    // 재화 정보
    const moneyInfos = await this.commonService.getMoneyInfo(exMember.id);

    // // 지갑 정보
    // const walletAddr = await this.commonService.GetWalletInfo(exMember.memberId);

    // 소셜 로그인 연동 정보
    const socialLoginInfo =
      await this.memberAccountRepository.findByMemberIdForSocialInfo(memberId);

    // 광고 컨텐츠 정보
    const memberAdContents = await this.dataSource
      .getRepository(MemberAdContents)
      .find({
        select: ['contentsId'],
        where: {
          memberId,
        },
      });

    return {
      membmerInfo,
      avatarInfos,
      businessCardInfos,
      defaultCardInfo,
      socialLoginInfo,
      myRoomList,
      myRoomFrameImages,
      interiorItemInvens,
      avatarPartsInvens,
      moneyInfos,
      memberAdContents,
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 패스워드 변경
  async changePassword(
    memberId: string,
    data: ChangePasswordDto,
    queryRunner: QueryRunner,
  ) {
    // 사용자 존재 여부 확인
    const memberAccount =
      await this.memberAccountRepository.findByMemberIdAndProviderType(
        memberId,
        PROVIDER_TYPE.ARZMETA,
      );

    if (!memberAccount) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 기존 패스워드 검증
    const password = data.password;

    const validPassword = await bcrypt.compareSync(
      password,
      memberAccount.password!,
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

    // 새패스워드
    const newHashedpassword = await bcrypt.hash(data.newPassword, 12);

    const newMemberAccount = new MemberAccount();
    newMemberAccount.memberId = memberId;
    newMemberAccount.password = newHashedpassword;
    newMemberAccount.providerType = PROVIDER_TYPE.ARZMETA;

    await this.memberAccountRepository.updateMemberAccount(
      newMemberAccount,
      queryRunner,
    );

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 기본 명함 설정 하기
  async setDefaultCardInfo(
    memberId: string,
    data: SetDefaultCardInfoDto,
    queryRunner: QueryRunner,
  ) {
    // 명함 유효성 검증
    const businessCardInfo =
      await this.memberBusinessCardInfoRepository.findOneByKey(
        memberId,
        data.templateId,
        data.num,
      );

    if (!businessCardInfo) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const defaultCard = new MemberDefaultCardInfo();
    defaultCard.memberId = memberId;
    defaultCard.templateId = data.templateId;
    defaultCard.num = data.num;

    const result = await this.memberDefaultCardInfoRepository.update(
      defaultCard,
      queryRunner,
    );

    return {
      defaultCardInfo: result,
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 기본 명함 설정 삭제
  async deleteDefaultCardInfo(memberId: string, queryRunner: QueryRunner) {
    await this.memberDefaultCardInfoRepository.delete(memberId, queryRunner);

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  async getDefaultCardInfo(memberId: string) {
    // 기본 명함 정보
    return await this.dataSource.getRepository(MemberDefaultCardInfo).findOne({
      select: { templateId: true, num: true },
      where: {
        memberId: memberId,
      },
    });
  }

  async getCSAFAdmin(memberId: string) {
    try {
      // 현재 진행 중인 행사 조회
      const eventInfo = await this.dataSource
        .getRepository(CSAFEventInfo)
        .findOne({
          where: {
            startedAt: LessThan(new Date()),
            endedAt: MoreThan(new Date()),
          },
        });

      const license = await this.dataSource
        .getRepository(MemberLicenseInfo)
        .createQueryBuilder('ml')
        .innerJoin('ml.LicenseInfo', 'li')
        .innerJoin('li.LicenseGroupInfo', 'lgi')
        .where('lgi.eventId = :eventId', { eventId: eventInfo.id })
        .andWhere('ml.memberId = :memberId', { memberId })
        .getOne();

      console.log(license);

      if (!license) {
        return {
          error: ERRORCODE.NET_E_DB_FAILED,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        };
      }

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getNotice() {
    const noticeInfos = [];
    const noticeTypes = await this.dataSource.getRepository(NoticeType).find();
    for (const noticeType of noticeTypes) {
      const notice = await this.dataSource
        .getRepository(NoticeInfo)
        .createQueryBuilder('n')
        .select([
          'n.id as id',
          'n.noticeType as noticeType',
          'n.noticeExposureType as noticeExposureType',
          'n.subject as subject',
          'n.koLink as koLink',
          'n.enLink as enLink',
          'n.startedAt as startedAt',
          'n.endedAt as endedAt',
        ])
        .where('n.startedAt < now() and n.endedAt > now()')
        .andWhere('n.noticeType = :noticeType', { noticeType: noticeType.type })
        .orderBy('n.startedAt', 'DESC')
        .addOrderBy('n.createdAt', 'DESC')
        .getRawOne();

      if (notice) {
        noticeInfos.push(notice);
      }
    }
    return noticeInfos;
  }

  checkUpdateOfficeGradeType = async () => {};
}
