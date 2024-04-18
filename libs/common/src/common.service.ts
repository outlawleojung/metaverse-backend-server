import {
  Member,
  MemberAvatarInfo,
  MemberAvatarPartsItemInven,
  MemberMyRoomInfo,
  OnfContentsInfo,
  StartInventory,
  StartMyRoom,
  MemberBusinessCardInfo,
  MemberDefaultCardInfo,
  ResetPasswdCount,
  FunctionTable,
  MemberFurnitureItemInven,
  MemberFrameImage,
  MemberMoney,
  MoneyType,
  MemberWalletInfo,
  CSAFEventEnterLog,
  LicenseInfo,
  MemberOfficeReservationInfo,
  CSAFEventBoothInfo,
  MemberAccount,
} from '@libs/entity';
import { v1 } from 'uuid';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { uuid } from 'uuidv4';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomDataLog, WorldChattingLog } from '@libs/mongodb';
import dayjs from 'dayjs';
import {
  ERRORCODE,
  ERROR_MESSAGE,
  FUNCTION_TABLE,
  ITEM_TYPE,
  PROVIDER_TYPE,
} from '@libs/constants';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberAccount)
    private memberAccountRepository: Repository<MemberAccount>,
    @InjectRepository(MemberWalletInfo)
    private memberWalletRepository: Repository<MemberWalletInfo>,
    @InjectRepository(MemberFurnitureItemInven)
    private memberFurnitureItemInvenRepository: Repository<MemberFurnitureItemInven>,
    @InjectRepository(MemberAvatarPartsItemInven)
    private memberAvatarPartsItemInvenRepository: Repository<MemberAvatarPartsItemInven>,
    @InjectModel('worldChattingLog')
    private readonly worldChattingLog: Model<WorldChattingLog>,
    @InjectModel('roomDataLog')
    private readonly roomDataLog: Model<RoomDataLog>,
    @Inject(DataSource) private dataSource,
  ) {}

  // 지갑 정보
  async getWalletInfo(memberId: string) {
    try {
      const walletInfo = await this.memberWalletRepository.findOne({
        where: {
          memberId: memberId,
        },
      });

      if (walletInfo) {
        return walletInfo.walletAddr;
      }

      return null;
    } catch (error) {
      console.error(error);
    }
  }

  async getAvatarInfo(memberId: string) {
    try {
      const avatarInfo = await this.dataSource
        .getRepository(MemberAvatarInfo)
        .find({
          where: {
            memberId,
          },
        });

      const avatarList: any = {};
      for (const avatar of avatarInfo) {
        avatarList[avatar.avatarPartsType] = avatar.itemId;
      }
      return avatarList;
    } catch (err) {
      console.error(err);
    }
  }

  async getMyRoomFrameImages(memberId: string) {
    try {
      const memberFrameImages = await this.dataSource
        .getRepository(MemberFrameImage)
        .find({
          select: ['itemId', 'num', 'uploadType', 'imageName'],
          where: {
            memberId: memberId,
          },
        });
      return memberFrameImages;
    } catch (err) {
      console.error(err);
    }
  }

  async getMyRoomInfo(memberId: string) {
    try {
      const myRoomInfos = await this.dataSource
        .getRepository(MemberMyRoomInfo)
        .find({
          select: {
            itemId: true,
            num: true,
            layerType: true,
            x: true,
            y: true,
            rotation: true,
          },
          where: {
            memberId: memberId,
          },
        });

      return myRoomInfos;
    } catch (err) {
      console.error(err);
    }
  }

  // 재화 정보 조회
  async getMoneyInfo(memberId: string) {
    try {
      const memberMoney = await this.dataSource
        .getRepository(MoneyType) // MoneyType을 기준으로 쿼리
        .createQueryBuilder('moneyType')
        .select([
          'moneyType.type as moneyType',
          'COALESCE(SUM(mm.count), 0) as count',
        ])
        .leftJoin('moneyType.MemberMoney', 'mm', 'mm.memberId = :memberId', {
          memberId,
        })
        .groupBy('moneyType.type')
        .getRawMany();

      memberMoney.forEach((m) => {
        m.count = parseInt(m.count, 10);
      });

      return memberMoney;
    } catch (error) {
      console.error(error);
    }
  }

  // 재화 차감
  async subtractMemberMoney(
    queryRunner: QueryRunner,
    memberId: string,
    moneyType: number,
    count: number,
  ) {
    try {
      const _memberMoney = await queryRunner.manager
        .getRepository(MemberMoney)
        .findOne({
          select: ['moneyType', 'count'],
          where: {
            memberId: memberId,
            moneyType: moneyType,
          },
        });

      let totalCount = 0;
      if (_memberMoney) {
        // 보유 재화가 작다면 오류
        if (_memberMoney.count < count) {
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_SUCCESS,
              message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
            },
            HttpStatus.FORBIDDEN,
          );
        }
        totalCount = _memberMoney.count - count;
      } else {
        // 보유 재화가 없다면 오류
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_SUCCESS,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const memberMoney = new MemberMoney();
      memberMoney.memberId = memberId;
      memberMoney.moneyType = moneyType;
      memberMoney.count = totalCount;

      await queryRunner.manager.getRepository(MemberMoney).save(memberMoney);
    } catch (error) {
      console.error(error);
    }
  }

  async getInteriorItemInven(memberId: string) {
    try {
      const interiorItemInvens = await this.dataSource
        .getRepository(MemberFurnitureItemInven)
        .find({
          select: { itemId: true, num: true },
          where: {
            memberId: memberId,
          },
        });

      return interiorItemInvens;
    } catch (err) {
      console.error(err);
    }
  }

  // 아바타 인벤토리
  async getAvatarPartsItemInven(memberId: string) {
    try {
      const avatarPartsItemInvens =
        await this.memberAvatarPartsItemInvenRepository.find({
          select: { itemId: true },
          where: {
            memberId: memberId,
          },
        });

      return avatarPartsItemInvens;
    } catch (err) {
      console.error(err);
    }
  }

  async createMemberAvatarPartsInventoryInit(
    memberId: string,
    queryRunner: QueryRunner,
  ) {
    // 기본 아바타 인벤토리 설정
    const memberAvatarPartsItemInven =
      await this.memberAvatarPartsItemInvenRepository.find({
        where: {
          memberId: memberId,
        },
      });

    if (memberAvatarPartsItemInven.length === 0) {
      const avatarPartsItems = await this.dataSource
        .getRepository(StartInventory)
        .createQueryBuilder('startInventory')
        .innerJoinAndSelect('startInventory.Item', 'item')
        .where('Item.itemType = :itemType', { itemType: ITEM_TYPE.COSTUME })
        .getMany();

      // 레코드 배열 생성
      const memberAvatarPartsItemInvens = avatarPartsItems.map((item) => {
        const memberAvatarPartsItemInven = new MemberAvatarPartsItemInven();
        memberAvatarPartsItemInven.memberId = memberId;
        memberAvatarPartsItemInven.itemId = item.itemId;
        return memberAvatarPartsItemInven;
      });

      // 한 번에 여러 레코드 저장
      await queryRunner.manager
        .getRepository(MemberAvatarPartsItemInven)
        .insert(memberAvatarPartsItemInvens);
    }
  }

  async createMemberInteriorInventoryInit(
    memberId: string,
    queryRunner: QueryRunner,
  ) {
    // 기본 인벤토리 설정 ( 인테리어)
    const memberFurnitureItemInven =
      await this.memberFurnitureItemInvenRepository.find({
        where: {
          memberId: memberId,
        },
      });

    if (memberFurnitureItemInven.length === 0) {
      const interiorItems = await this.dataSource
        .getRepository(StartInventory)
        .createQueryBuilder('startInventory')
        .innerJoinAndSelect('startInventory.Item', 'item')
        .where('Item.itemType = :itemType', { itemType: ITEM_TYPE.INTERIOR })
        .getMany();

      const invens = [];

      let num = 1;
      for (const item of interiorItems) {
        const inven = new MemberFurnitureItemInven();
        inven.memberId = memberId;
        inven.itemId = item.itemId;
        inven.num = num;

        invens.push(inven);

        num++;
      }

      // 한 번의 쿼리로 저장
      await queryRunner.manager
        .getRepository(MemberFurnitureItemInven)
        .insert(invens);
    }
  }

  async createMemberMyRoomInit(memberId: string, queryRunner: QueryRunner) {
    const memberMyRoomInfo = await this.dataSource
      .getRepository(MemberMyRoomInfo)
      .find({
        where: {
          memberId: memberId,
        },
      });

    if (memberMyRoomInfo.length === 0) {
      const defaultMyRoomItems = await this.dataSource
        .getRepository(StartMyRoom)
        .find();
      const memberInvens = await queryRunner.manager
        .getRepository(MemberFurnitureItemInven)
        .find({
          where: {
            memberId: memberId,
          },
        });

      const myRoomInfosToInsert = [];

      for (const item of defaultMyRoomItems) {
        const matchingInvens = memberInvens.filter(
          (inven) => inven.itemId === item.itemId,
        );

        for (const inven of matchingInvens) {
          const isDuplicated = myRoomInfosToInsert.some(
            (item) =>
              inven.memberId === memberId &&
              inven.itemId === item.itemId &&
              inven.num === item.num,
          );

          if (!isDuplicated) {
            const myRoomInfo = new MemberMyRoomInfo();
            myRoomInfo.memberId = memberId;
            myRoomInfo.itemId = item.itemId;
            myRoomInfo.num = inven.num;
            myRoomInfo.layerType = item.layerType;
            myRoomInfo.x = item.x;
            myRoomInfo.y = item.y;
            myRoomInfo.rotation = item.rotation;
            myRoomInfosToInsert.push(myRoomInfo);
            break;
          }
        }
      }

      if (myRoomInfosToInsert.length > 0) {
        await queryRunner.manager
          .getRepository(MemberMyRoomInfo)
          .insert(myRoomInfosToInsert);
      }
    }
  }

  async getMemberInfo(memberId: string) {
    try {
      return await this.memberRepository.findOne({
        select: [
          'memberId',
          'memberCode',
          'providerType',
          'officeGradeType',
          'myRoomStateType',
          'nickname',
          'stateMessage',
        ],
        where: {
          memberId: memberId,
        },
      });
    } catch (error) {
      throw new ForbiddenException('DB 실패');
    }
  }

  async getBusinessCardList(memberId: string) {
    const businessCardInfos = await this.dataSource
      .getRepository(MemberBusinessCardInfo)
      .createQueryBuilder('b')
      .select([
        'b.templateId',
        'b.num',
        'b.name',
        'b.phone',
        'b.email',
        'b.addr',
        'b.fax',
        'b.job',
        'b.position',
        'b.intro',
        'b.thumbnail',
      ])
      .where('b.memberId= :memberId', { memberId })
      .getMany();

    return businessCardInfos;
  }

  async getDefaultCardInfo(memberId: string) {
    const defaultCardInfo = await this.dataSource
      .getRepository(MemberDefaultCardInfo)
      .findOne({
        select: ['templateId', 'num'],
        where: {
          memberId: memberId,
        },
      });
    return defaultCardInfo;
  }

  async getOnfContentsInfo() {
    return await this.dataSource.getRepository(OnfContentsInfo).find();
  }

  async gnenerateMemberCode() {
    // 유저코드 발급
    let memberCode = '';
    while (true) {
      memberCode = await this.randomString(12);

      const exMemberCode = await this.memberRepository.findOne({
        where: {
          memberCode: memberCode,
        },
      });

      if (!exMemberCode) {
        return memberCode;
      }
    }
  }

  randomString(num: number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    const stringLength = num;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  // 이미지 처리
  getImageName(name: string) {
    const extension = name.split('.').pop();
    const filaName = uuid() + '.' + extension;
    return filaName;
  }

  // 패스워드 재설정을 위한 이메일 및 본인인증 검증 횟수 체크
  async isResetPasswordEmailAndIdentification(
    id: string,
    queryRunner: QueryRunner,
  ) {
    const emailCount = await this.dataSource
      .getRepository(ResetPasswdCount)
      .findOne({
        where: { id: id },
      });

    const maxEamilCount = await this.dataSource
      .getRepository(FunctionTable)
      .findOne({
        where: {
          id: FUNCTION_TABLE.MAX_EMAIL_AUTH,
        },
      });

    if (!emailCount) {
      const resetPasswdCount = new ResetPasswdCount();
      resetPasswdCount.id = id;
      resetPasswdCount.count = 1;

      await queryRunner.manager
        .getRepository(ResetPasswdCount)
        .save(resetPasswdCount);
    } else {
      const now = new Date();

      if (this.isSameDate(new Date(emailCount.updatedAt), now)) {
        if (emailCount.count >= maxEamilCount.value) {
          return false;
        } else {
          const resetPasswdCount = new ResetPasswdCount();
          resetPasswdCount.id = id;
          resetPasswdCount.count = emailCount.count + 1;
          await queryRunner.manager
            .getRepository(ResetPasswdCount)
            .save(resetPasswdCount);
        }
      } else {
        const resetPasswdCount = new ResetPasswdCount();
        resetPasswdCount.id = id;
        resetPasswdCount.count = 1;

        await queryRunner.manager
          .getRepository(ResetPasswdCount)
          .save(resetPasswdCount);
      }
    }
    return true;
  }

  // 아바타 정보 조회
  async getMemberAvatarInfo(memberCode: string) {
    const member = await this.dataSource.getRepository(Member).findOne({
      where: {
        memberCode: memberCode,
      },
    });

    if (member) {
      const avatarInfos = await this.dataSource
        .getRepository(MemberAvatarInfo)
        .find({
          select: ['avatarPartsType', 'itemId'],
          where: {
            memberId: member.memberId,
          },
        });

      const avatarList: any = {};
      for (const avatar of avatarInfos) {
        avatarList[avatar.avatarPartsType] = avatar.itemId;
      }
      return avatarList;
    }

    return null;
  }

  // 아바타 정보 조회
  async getMemberAvatarInfos(memberCode: string[]) {
    const member = await this.dataSource.getRepository(Member).findOne({
      where: {
        memberCode: memberCode,
      },
    });

    if (member) {
      const avatarInfos = await this.dataSource
        .getRepository(MemberAvatarInfo)
        .find({
          select: ['avatarPartsType', 'itemId'],
          where: {
            memberId: member.memberId,
          },
        });

      const avatarList: any = {};
      for (const avatar of avatarInfos) {
        avatarList[avatar.avatarPartsType] = avatar.itemId;
      }
      return avatarList;
    }

    return null;
  }

  async getMemberFrameImages(memberId: string) {
    const frameImages = await this.dataSource
      .getRepository(MemberFrameImage)
      .find({
        select: ['itemId', 'num', 'uploadType', 'imageName'],
        where: {
          memberId,
        },
      });

    return frameImages;
  }

  // 같은 날짜 인지 비교
  private isSameDate(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  async getFurnitureItemNum(queryRunner: QueryRunner, memberId: string) {
    const maxNum = await queryRunner.manager
      .getRepository(MemberFurnitureItemInven)
      .createQueryBuilder('m')
      .select('MAX(m.num)', 'maxNum')
      .where('m.memberId = :memberId', { memberId })
      .getRawOne();

    return maxNum ? maxNum.maxNum : 0;
  }

  // MongoDB 채팅 로그 불러오기
  async getMongoDBChatLog(roomCode: string) {
    const result = await this.worldChattingLog
      .find({ roomCode: roomCode })
      .exec();
    return result;
  }

  // 행사 하위 부스 정보 로그
  async getEventBoothInfoLog(eventId: number) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventBoothRoomCode = await this.dataSource
        .getRepository(CSAFEventBoothInfo)
        .find({
          where: {
            eventId: eventId,
          },
        });
      const roomInfos = [];
      for (const BoothRoomCode of eventBoothRoomCode) {
        const getRoomInfo: MemberOfficeReservationInfo = await this.dataSource
          .getRepository(MemberOfficeReservationInfo)
          .findOne({
            where: {
              id: BoothRoomCode.boothId,
            },
          });
        const getMemberInfo = await this.dataSource
          .getRepository(Member)
          .findOne({
            where: {
              memberId: getRoomInfo.memberId,
            },
          });
        const resultDAU = await this.roomDataLog
          .aggregate([
            {
              $match: {
                roomCode: getRoomInfo.roomCode,
                createdAt: {
                  $gte: getRoomInfo.createdAt,
                  $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
              },
            },
            {
              $group: {
                _id: {
                  memberId: '$memberId',
                  date: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                  },
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ])
          .exec();
        const uniqueMemberCount = resultDAU.length > 0 ? resultDAU[0].count : 0;
        const result = await this.roomDataLog
          .countDocuments({
            roomCode: getRoomInfo.roomCode,
          })
          .exec();
        const roomInfo: any = {};
        (roomInfo.createdAt = dayjs(getRoomInfo.createdAt).format(
          'YYYY-MM-DD HH:mm',
        )), // 등록 시간
          (roomInfo.roomCode = getRoomInfo.roomCode); // 룸 코드
        roomInfo.roomName = getRoomInfo.name; //룸 이름
        roomInfo.nickname = getMemberInfo.nickname; // 등록자 닉네임
        roomInfo.dau = uniqueMemberCount; // DAU (부스)
        roomInfo.all = result; //총 방문자 수 (부스)
        roomInfos.push(roomInfo);
      }
      console.log(roomInfos);
      return roomInfos;
    } catch (error) {
      console.log(error);
    }
  }

  //  행사 로비 입장 로그
  async getCsafEventEnterLog(eventId: number) {
    try {
      const eventEnterLogs = await this.dataSource
        .getRepository(CSAFEventEnterLog)
        .createQueryBuilder('ceel')
        .select([
          'DATE_FORMAT(ceel.createdAt, "%Y-%m-%d") AS date',
          'ceel.eventId as eventId',
          'eventInfo.name as eventName',
          'COUNT(DISTINCT ceel.memberId) AS dau',
        ])
        .addSelect(
          `(SELECT COUNT(memberId) FROM csafEventEnterLog AS e2 WHERE e2.eventId = :eventId 
          AND DATE_FORMAT(e2.createdAt, "%Y-%m-%d") = DATE_FORMAT(ceel.createdAt, "%Y-%m-%d")) AS cumulativeMembers`,
        )
        .innerJoin('ceel.CSAFEventInfo', 'eventInfo')
        .where('ceel.eventId = :eventId', { eventId })
        .groupBy('ceel.eventId, date')
        .orderBy('ceel.eventId, date', 'ASC')
        .getRawMany();

      return eventEnterLogs;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('DB Failed');
    }
  }

  async getEventLicenses(groupId: number) {
    try {
      const licenses = await this.dataSource
        .getRepository(LicenseInfo)
        .createQueryBuilder('li')
        .select([
          'li.licenseSerial as licenseSerial',
          'lg.name as licenseName',
          'lg.licenseType as licenseType',
          'lt.name as licenseTypeName',
          'cei.name as eventName',
          'lg.startedAt as startedAt',
          'lg.endedAt as endedAt',
          'mli.createdAt as registedAt',
          'member.memberCode',
        ])
        .addSelect(
          `CASE
          WHEN lg.endedAt < now() then '기간 만료'
          WHEN li.isCompleted = 1 then '사용 완료'
          WHEN lg.endedAt > now() and member.memberId IS NOT NULL and li.isCompleted = 0 then '사용 중'
          WHEN member.memberId IS NULL and lg.endedAt > now() and li.isCompleted = 0 then '미등록'  
        END`,
          'stateTypeName',
        )
        .innerJoin('li.LicenseGroupInfo', 'lg')
        .innerJoin('lg.LicenseType', 'lt')
        .innerJoin('lg.CSAFEventInfo', 'cei')
        .leftJoin('li.MemberLicenseInfos', 'mli')
        .leftJoin('mli.Member', 'member')
        .where('lg.id = :groupId', { groupId })
        .withDeleted()
        .getRawMany();

      return licenses;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('DB Failed');
    }
  }

  async getMemberByEmail(email: string): Promise<Member> {
    const memberAccount = await this.memberAccountRepository.findOne({
      where: {
        providerType: PROVIDER_TYPE.ARZMETA,
        accountToken: email,
      },
    });

    return await this.memberRepository.findOne({
      select: ['memberId', 'memberCode', 'nickname', 'email'],
      where: {
        memberId: memberAccount.memberId,
      },
    });
  }

  async getMemberAccountByEmail(email: string): Promise<MemberAccount> {
    return await this.memberAccountRepository.findOne({
      select: ['memberId', 'password'],
      where: {
        providerType: PROVIDER_TYPE.ARZMETA,
        accountToken: email,
      },
    });
  }

  // 공용 계정 생성 모듈
  async commonCreateAccount(
    queryRunner: QueryRunner,
    accountToken,
    providerType,
    regPathType,
  ): Promise<Member> {
    // 유니크 아이디 (memberId) 발급
    const memberId = v1();

    const memberCode = await this.gnenerateMemberCode();

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
    await this.createMemberInteriorInventoryInit(member.memberId, queryRunner);

    // 기본 마이룸 설정
    await this.createMemberMyRoomInit(member.memberId, queryRunner);

    // 기본 아바타 파츠 설정
    await this.createMemberAvatarPartsInventoryInit(
      member.memberId,
      queryRunner,
    );

    // 계정 생성
    const memberAccount = new MemberAccount();
    memberAccount.memberId = member.memberId;
    memberAccount.providerType = providerType;
    memberAccount.accountToken = accountToken;

    await queryRunner.manager.getRepository(MemberAccount).save(memberAccount);

    return member;
  }
}
