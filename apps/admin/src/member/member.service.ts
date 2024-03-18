import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { GetTableDto } from '../common/dto/get.table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Member,
  ProviderType,
  User,
  OfficeGradeType,
  MemberAccount,
  RegPathType,
  AdminLog,
} from '@libs/entity';
import { DataSource, Repository } from 'typeorm';
import {
  LOG_ACTION_TYPE,
  LOG_CONTENT_TYPE,
  REG_PATH_TYPE,
  SEARCH_TYPE,
} from '@libs/constants';
import { EndedUnixTimestamp, StartedUnixTimestamp } from '@libs/common';
import dayjs from 'dayjs';

@Injectable()
export class MemberService {
  private readonly logger = new Logger(MemberService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(ProviderType)
    private roleTypeRepository: Repository<ProviderType>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  async getConstants() {
    const providerType = await this.dataSource
      .getRepository(ProviderType)
      .find();
    const regPathType = await this.dataSource.getRepository(RegPathType).find();
    const officeGradeType = await this.dataSource
      .getRepository(OfficeGradeType)
      .createQueryBuilder('o')
      .select(['o.type as type', 'name.kor as name'])
      .leftJoin('o.LocalizationName', 'name')
      .getRawMany();

    return {
      providerType,
      regPathType,
      officeGradeType,
    };
  }

  async getMemberList(adminid: number, data: GetTableDto) {
    const limit = 10;
    const offset = 0 + (data.page - 1) * limit;
    const searchType = data.searchType;
    const searchValue = data.searchValue;

    let startedAt = new Date();
    let endedAt = new Date();

    try {
      const memberList = await this.memberRepository
        .createQueryBuilder('m')
        .select([
          'm.memberId',
          'm.memberCode',
          'm.nickname',
          'm.email',
          'm.createdAt',
          'm.firstProviderType',
          'providerType.name',
          'm.regPathType',
          'm.officeGradeType',
          'regPathType.name',
          'officeGradeType.name',
        ])
        .innerJoin('m.ProviderType', 'providerType')
        .innerJoin('m.OfficeGradeType', 'officeGradeType')
        .leftJoin('m.RegPathType', 'regPathType')
        .offset(offset)
        .limit(limit);

      const memberCount = await this.memberRepository
        .createQueryBuilder('m')
        .select([
          'm.memberId',
          'm.memberCode',
          'm.nickname',
          'm.email',
          'm.createdAt',
          'm.firstProviderType',
          'm.regPathType',
          'providerType.name',
          'm.officeGradeType',
          'officeGradeType.name',
          'regPathType.name',
        ])
        .innerJoin('m.ProviderType', 'providerType')
        .innerJoin('m.OfficeGradeType', 'officeGradeType')
        .leftJoin('m.RegPathType', 'regPathType');

      switch (searchType) {
        case SEARCH_TYPE.TOTAL:
          memberList.orWhere('m.nickname like :nickname', {
            nickname: `%${searchValue}%`,
          });
          memberList.orWhere('m.email like :email', {
            email: `%${searchValue}%`,
          });
          memberList.orWhere('m.memberCode like :memberCode', {
            memberCode: `%${searchValue}%`,
          });

          memberCount.orWhere('m.nickname like :nickname', {
            nickname: `%${searchValue}%`,
          });
          memberCount.orWhere('m.email like :email', {
            email: `%${searchValue}%`,
          });
          memberCount.orWhere('m.memberCode like :memberCode', {
            memberCode: `%${searchValue}%`,
          });
          break;

        case SEARCH_TYPE.OFFICE_GRADE_TYPE:
          memberList.orWhere('m.officeGradeType = :officeGradeType', {
            officeGradeType: Number(searchValue),
          });
          memberCount.orWhere('m.officeGradeType = :officeGradeType', {
            officeGradeType: Number(searchValue),
          });
          break;

        case SEARCH_TYPE.PROVIDER_TYPE:
          memberList.orWhere('m.firstProviderType = :providerType', {
            providerType: Number(searchValue),
          });
          memberCount.orWhere('m.firstProviderType = :providerType', {
            providerType: Number(searchValue),
          });
          break;

        case SEARCH_TYPE.CREATED_AT:
          this.logger.debug('CREATED_AT');
          const searchValueArr = String(searchValue).split('|');
          this.logger.debug(searchValueArr[0]);
          this.logger.debug(searchValueArr[1]);
          startedAt = new Date(StartedUnixTimestamp(Number(searchValueArr[0])));
          endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));
          this.logger.debug(startedAt);
          this.logger.debug(endedAt);
          memberList.where('m.createdAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          memberList.andWhere('m.createdAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });

          memberCount.where('m.createdAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          memberCount.andWhere('m.createdAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          break;
        case SEARCH_TYPE.REG_PATH_TYPE:
          memberList.orWhere('m.regPathType = :regPathType', {
            regPathType: searchValue,
          });
          memberCount.orWhere('m.regPathType = :regPathType', {
            regPathType: searchValue,
          });
          if (Number(searchValue) === REG_PATH_TYPE.ETC) {
            memberList.orWhere('m.regPathType is NULL');
            memberCount.orWhere('m.regPathType is NULL');
          }

          break;
      }

      const rows = await memberList.getMany();
      const count = await memberCount.getCount();
      console.log('count: ', count);

      this.logger.debug('rows : ', rows.length);
      this.logger.debug('count : ', count);

      return { rows, count };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    }
  }

  async getMember(memberId: string) {
    try {
      const member = await this.memberRepository
        .createQueryBuilder('m')
        .select([
          'm.memberId as memberId',
          'm.memberCode as memberCode',
          'm.nickname as nickname',
          'm.email as email',
          'providerType.name as providerTypeName',
          'm.regPathType as regPathType',
          'regPathType.name as regPathTypeName',
          'localizationName.kor as officeGradeTypeName',
          'mi.name as name',
          'mi.birthdate as birthdate',
          'mi.gender as gender',
          'mi.phoneNumber as phoneNumber',
          // 'officeLicenseDomainInfo.affiliation as affiliation',
          // 'licenseInfo.licenseSerial as licenseSerial',
          'm.createdAt as createdAt',
          'm.loginedAt as loginedAt',
        ])
        .addSelect(
          `CASE
          WHEN mi.memberId IS NULL then 'N'
          ELSE 'Y'
          END`,
          'isIdentification',
        )
        .innerJoin('m.ProviderType', 'providerType')
        .leftJoin('m.OfficeGradeType', 'officeGradeType')
        .leftJoin('m.RegPathType', 'regPathType')
        .leftJoin('officeGradeType.LocalizationName', 'localizationName')
        .leftJoin('m.MemberIdentification', 'mi')
        .where('m.memberId= :memberId', { memberId })
        .getRawOne();

      if (!member) {
        throw new ForbiddenException('존재하지 않는 사용자');
      }

      const memberWithDomainLicense = await this.memberRepository
        .createQueryBuilder('m')
        .select([
          'officeLicenseDomainInfo.affiliation as affiliation',
          'licenseInfo.licenseSerial as licenseSerial',
        ])
        .leftJoin('m.MemberLicenseInfos', 'memberLicenseInfo')
        .leftJoin('memberLicenseInfo.LicenseInfo', 'licenseInfo')
        .leftJoin('licenseInfo.LicenseGroupInfo', 'licenseGroupInfo')
        .leftJoin(
          'licenseGroupInfo.OfficeLicenseDomainInfo',
          'officeLicenseDomainInfo',
        )
        .where('m.memberId= :memberId', { memberId })
        .andWhere('licenseGroupInfo.domainId IS NOT NULL')
        .getRawOne();

      const memberWithEventLicense = await this.memberRepository
        .createQueryBuilder('m')
        .select([
          'licenseInfo.licenseSerial as licenseSerial',
          'eventInfo.name as name',
        ])
        .leftJoin('m.MemberLicenseInfos', 'memberLicenseInfo')
        .leftJoin('memberLicenseInfo.LicenseInfo', 'licenseInfo')
        .leftJoin('licenseInfo.LicenseGroupInfo', 'licenseGroupInfo')
        .leftJoin('licenseGroupInfo.CSAFEventInfo', 'eventInfo')
        .where('m.memberId= :memberId', { memberId })
        .andWhere('licenseGroupInfo.eventId IS NOT NULL')
        .getRawOne();

      const memberAccount = await this.dataSource
        .getRepository(MemberAccount)
        .find({
          select: ['providerType'],
          where: {
            memberId: memberId,
          },
        });

      member.memberAccount = memberAccount;
      member.domainLicense = memberWithDomainLicense?.licenseSerial ?? null;
      member.affiliation = memberWithDomainLicense?.affiliation ?? null;
      member.eventLicense = memberWithEventLicense?.licenseSerial ?? null;
      member.eventName = memberWithEventLicense?.name ?? null;

      return member;
    } catch (error) {
      console.error(error);
      if (error instanceof ForbiddenException) {
        throw error;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    }
  }

  async getProviderTypes() {
    const providerTypes = await this.dataSource
      .getRepository(ProviderType)
      .find();
    return providerTypes;
  }
  async getOfficeGradeTypes() {
    const officeGradeTypes = await this.dataSource
      .getRepository(OfficeGradeType)
      .find();
    return officeGradeTypes;
  }

  async updateMemberOfficeGradeType(
    adminId: number,
    memberId: string,
    officeGradeType: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const member = await this.memberRepository.findOne({
        where: {
          memberId: memberId,
        },
      });

      if (!member) {
        throw new ForbiddenException('존재하지 않는 사용자');
      }

      if (member.officeGradeType === officeGradeType) {
        throw new ForbiddenException('등급을 변경해주세요.');
      }

      const newMember = new Member();
      newMember.memberId = memberId;
      newMember.officeGradeType = officeGradeType;

      await queryRunner.manager.getRepository(Member).save(newMember);

      const adminLog = new AdminLog();
      adminLog.adminId = adminId;
      adminLog.beforeData = JSON.stringify({
        memberId: memberId,
        officeGradeType: member.officeGradeType,
      });
      adminLog.afterData = JSON.stringify({
        memberId: memberId,
        officeGradeType: officeGradeType,
      });
      adminLog.actionType = LOG_ACTION_TYPE.UPDATE;
      adminLog.contentType = LOG_CONTENT_TYPE.OFFICE_GRADE_TYPE;

      await queryRunner.manager.getRepository(AdminLog).save(adminLog);

      await queryRunner.commitTransaction();

      return HttpStatus.OK;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    } finally {
      await queryRunner.release();
    }
  }
}
