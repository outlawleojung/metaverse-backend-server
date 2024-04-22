import { ForbiddenException } from '@nestjs/common/exceptions';
import {
  MemberFriendRequest,
  LicenseType,
  OfficeLicenseDomainInfo,
  LicenseGroupInfo,
  LicenseInfo,
} from '@libs/entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import couponCode from 'coupon-code';
import {
  ADMIN_PAGE,
  ALL_LICENSE_STATE_TYPE,
  AFFILIATION_LICENSE_STATE_TYPE,
  SEARCH_TYPE,
} from '@libs/constants';
import { CreateDomainDto } from './req/create.domain.dto';
import { UpdateDomainDto } from './req/update.domain.dto';
import { EndedUnixTimestamp, StartedUnixTimestamp } from '@libs/common';
import dayjs from 'dayjs';
import { CreateLicenseDto } from './req/create.license.dto';
import { UpdateLicenseDto } from './req/update.license.dto';
import { CommonService } from '../common/common.service';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(OfficeLicenseDomainInfo)
    private officeLicenseDomainInfoRepository: Repository<OfficeLicenseDomainInfo>,
    @InjectRepository(LicenseInfo)
    private licenseInfoRepository: Repository<LicenseInfo>,
    @InjectRepository(LicenseGroupInfo)
    private licenseGroupInfoRepository: Repository<LicenseGroupInfo>,
    @Inject(DataSource) private dataSource: DataSource,
    private commonService: CommonService,
  ) {}
  private readonly logger = new Logger(LicenseService.name);

  // 전체 라이선스 조회
  async getLicenses(
    _page: number,
    searchType: string,
    searchValue: string,
    searchDateTime: string,
    licenseType: number,
    stateType: number,
  ) {
    const page = _page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    const licenses = await this.licenseInfoRepository
      .createQueryBuilder('o')
      .select([
        'o.licenseSerial as licenseSerial',
        'oldi.affiliation as affiliation',
        'olg.licenseType as licenseType',
        'olg.name as licenseName',
        'olg.startedAt as startedAt',
        'olg.endedAt as endedAt',
        'moli.createdAt as memberRegiseteredAt',
        'member.memberCode as memberCode',
        'moli.email as authEmail',
      ])
      .addSelect(
        `CASE
        WHEN olg.endedAt < now() then ${ALL_LICENSE_STATE_TYPE.EXPIRED}
        WHEN o.isCompleted = 1 then ${ALL_LICENSE_STATE_TYPE.IS_USE_COMPLETED}
        WHEN olg.endedAt > now() and member.memberId IS NOT NULL and o.isCompleted = 0 then ${ALL_LICENSE_STATE_TYPE.IS_USING}
        WHEN member.memberId IS NULL and olg.endedAt > now() and o.isCompleted = 0 then ${ALL_LICENSE_STATE_TYPE.NOT_REGISTERED}
      END`,
        'stateType',
      )
      .addSelect(
        `CASE
        WHEN olg.endedAt < now() then '기간 만료'
        WHEN o.isCompleted = 1 then '사용 완료'
        WHEN olg.endedAt > now() and member.memberId IS NOT NULL and o.isCompleted = 0 then '사용 중'
        WHEN member.memberId IS NULL and olg.endedAt > now() and o.isCompleted = 0 then '미등록'  
      END`,
        'stateTypeName',
      )
      .leftJoin('o.MemberLicenseInfos', 'moli')
      .innerJoin('o.LicenseGroupInfo', 'olg')
      .innerJoin('olg.OfficeLicenseDomainInfo', 'oldi')
      .leftJoin('moli.Member', 'member')
      .leftJoin('olg.Admin', 'admin')
      .offset(offset)
      .limit(limit)
      .orderBy('olg.createdAt', 'DESC')
      .withDeleted();

    const licensesCount = await this.licenseInfoRepository
      .createQueryBuilder('o')
      .leftJoin('o.MemberLicenseInfos', 'moli')
      .innerJoin('o.LicenseGroupInfo', 'olg')
      .innerJoin('olg.OfficeLicenseDomainInfo', 'oldi')
      .leftJoin('moli.Member', 'member')
      .leftJoin('olg.Admin', 'admin')
      .withDeleted();

    switch (searchType) {
      case SEARCH_TYPE.OFFICE_LICENSE_NAME:
        licenses.andWhere('olg.name like :name', { name: `%${searchValue}%` });
        licensesCount.andWhere('olg.name like :name', {
          name: `%${searchValue}%`,
        });
        break;
      case SEARCH_TYPE.AFFILIATION:
        licenses.andWhere('oldi.affiliation like :affiliation', {
          affiliation: `%${searchValue}%`,
        });
        licensesCount.andWhere('oldi.affiliation like :affiliation', {
          affiliation: `%${searchValue}%`,
        });
        break;
      case SEARCH_TYPE.MEMBER_CODE:
        licenses.andWhere('member.memberCode like :memberCode', {
          memberCode: `%${searchValue}%`,
        });
        licensesCount.andWhere('member.memberCode like :memberCode', {
          memberCode: `%${searchValue}%`,
        });
        break;
      default:
        break;
    }

    // 유효 기간 검색
    if (searchDateTime) {
      const searchValueArr = String(searchDateTime).split('|');
      const startedAt = new Date(
        StartedUnixTimestamp(Number(searchValueArr[0])),
      );
      const endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

      licenses.andWhere('olg.startedAt >= :startedAt', {
        startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
      });
      licenses.andWhere('olg.endedAt <= :endedAt', {
        endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
      });

      licensesCount.andWhere('olg.startedAt >= :startedAt', {
        startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
      });
      licensesCount.andWhere('olg.endedAt <= :endedAt', {
        endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    // 라이선스 타입 검색
    if (licenseType) {
      licenses.andWhere(`olg.licenseType = :licenseType`, {
        licenseType: licenseType,
      });
      licensesCount.andWhere(`olg.licenseType = :licenseType`, {
        licenseType: licenseType,
      });
    }

    // 상태 타입 검색
    console.log(stateType);
    if (stateType) {
      if (stateType === ALL_LICENSE_STATE_TYPE.EXPIRED) {
        licenses.andWhere('olg.endedAt < now()');
        licensesCount.andWhere('olg.endedAt < now()');
      } else if (stateType === ALL_LICENSE_STATE_TYPE.IS_USE_COMPLETED) {
        licenses.andWhere('o.isCompleted = 1');
        licensesCount.andWhere('o.isCompleted = 1');
      } else if (stateType === ALL_LICENSE_STATE_TYPE.IS_USING) {
        licenses.andWhere(
          'olg.endedAt > now() and member.memberId IS NOT NULL and o.isCompleted = 0',
        );
        licensesCount.andWhere(
          'olg.endedAt > now() and member.memberId IS NOT NULL and o.isCompleted = 0',
        );
      } else if (stateType === ALL_LICENSE_STATE_TYPE.NOT_REGISTERED) {
        licenses.andWhere(
          'member.memberId IS NULL and olg.endedAt > now() and o.isCompleted = 0',
        );
        licensesCount.andWhere(
          'member.memberId IS NULL and olg.endedAt > now() and o.isCompleted = 0',
        );
      }
    }

    const rows = await licenses.getRawMany();
    const count = await licensesCount.getCount();

    return {
      rows,
      count,
    };
  }

  // 소속 라이선스 목록 조회 - 다운로드용
  async getLicense(groupId: number) {
    const licenses = await this.licenseInfoRepository
      .createQueryBuilder('oli')
      .select([
        'oli.licenseSerial as licenseSerial',
        'o.name as licenseName',
        'oldi.affiliation as affiliation',
        'o.licenseType as licenseType',
        'o.startedAt as startedAt',
        'o.endedAt as endedAt',
        'member.memberCode as memberCode',
        'moli.createdAt as registerdAt',
        'moli.email as email',
      ])
      .addSelect(
        `CASE
      WHEN o.endedAt > now() and o.startedAt < now() then '사용중'
      WHEN o.startedAt > now() then '사용 대기'
      ELSE '기간 만료'
      END`,
        'stateTypeName',
      )
      .innerJoin('oli.LicenseGroupInfo', 'o')
      .innerJoin('o.OfficeLicenseDomainInfo', 'oldi')
      .leftJoin('oli.MemberLicenseInfos', 'moli')
      .leftJoin('moli.Member', 'member')
      .where('o.id = :groupId', { groupId })
      .orderBy('o.createdAt', 'DESC')
      .withDeleted()
      .getRawMany();

    return licenses;
  }

  // 라이선스 발급
  async createLicense(adminId: number, data: CreateLicenseDto) {
    // 도메인 유효성 검증
    const domain = await this.officeLicenseDomainInfoRepository.findOne({
      where: {
        id: data.domainId,
      },
    });

    if (!domain) {
      throw new ForbiddenException('존재하지 않는 도메인 입니다.');
    }

    if (data.expirationDay > 90) {
      throw new ForbiddenException(
        '등록 만료일은 90일 이상 설정 할 수 없습니다.',
      );
    }

    if (data.issueCount > 500) {
      throw new ForbiddenException(
        '라이선스는 500개 이상 발급 할 수 없습니다.',
      );
    }

    const newLicenseGroup = new LicenseGroupInfo();
    newLicenseGroup.domainId = data.domainId;
    newLicenseGroup.name = data.licenseName;
    newLicenseGroup.startedAt = new Date(data.startedAt);
    newLicenseGroup.endedAt = new Date(data.endedAt);
    newLicenseGroup.expirationDay = data.expirationDay;
    newLicenseGroup.issueCount = data.issueCount;
    newLicenseGroup.licenseType = data.licenseType;
    newLicenseGroup.adminId = adminId;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(LicenseGroupInfo)
        .save(newLicenseGroup);

      // 라이선스 키 생성
      await this.commonService.generateLicense(
        data.issueCount,
        newLicenseGroup.id,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      const licenses = await this.licenseInfoRepository
        .createQueryBuilder('o')
        .select([
          'o.licenseSerial as licenseSerial',
          'oldi.affiliation as affiliation',
          'olg.licenseType as licenseType',
          'olg.name as licenseName',
          'olg.startedAt as startedAt',
          'olg.endedAt as endedAt',
          'olg.createdAt as createdAt',
          'olg.expirationDay as expirationDay',
          'admin.name as adminName',
        ])
        .addSelect(
          `CASE
          WHEN olg.endedAt < now() then ${ALL_LICENSE_STATE_TYPE.EXPIRED}
          ELSE 
          ${ALL_LICENSE_STATE_TYPE.NOT_REGISTERED}
          END`,
          'stateType',
        )
        .addSelect(
          `CASE
            WHEN olg.endedAt < now() then '기간 만료'
            ELSE 
            '미등록'
          END`,
          'stateTypeName',
        )
        .innerJoin('o.LicenseGroupInfo', 'olg')
        .innerJoin('olg.OfficeLicenseDomainInfo', 'oldi')
        .leftJoin('olg.Admin', 'admin')
        .where('o.groupId = :groupId', { groupId: newLicenseGroup.id })
        .orderBy('o.createdAt', 'DESC')
        .getRawMany();

      return licenses;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 소속/라이선스 조회
  async getAffiliationLicenses(
    _page: number,
    searchType: string,
    searchValue: string,
    searchDateTime: string,
    licenseType: number,
    stateType: number,
  ) {
    const page = _page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    const licenses = await this.licenseGroupInfoRepository
      .createQueryBuilder('o')
      .select([
        'o.id as id',
        'o.name as licenseName',
        'oldi.affiliation as affiliation',
        'o.licenseType as licenseType',
        'o.startedAt as startedAt',
        'o.endedAt as endedAt',
        'o.expirationDay as expirationDay',
        'o.issueCount as issueCount',
        'o.useCount as useCount',
        'o.createdAt as createdAt',
        'oldi.domainName as domainName',
        'admin.name as adminName',
      ])
      .addSelect(
        `CASE
        WHEN o.endedAt > now() and o.startedAt < now() then ${AFFILIATION_LICENSE_STATE_TYPE.IS_USING}
        WHEN o.startedAt > now() then ${AFFILIATION_LICENSE_STATE_TYPE.WAITING_USE}
        WHEN o.endedAt < now() then ${AFFILIATION_LICENSE_STATE_TYPE.EXPIRED}
        END`,
        'stateType',
      )
      .addSelect(
        `CASE
        WHEN o.endedAt > now() and o.startedAt < now() then '사용중'
        WHEN o.startedAt > now() then '사용 대기'
        WHEN o.endedAt < now() then '기간 만료'
        END`,
        'stateTypeName',
      )
      .innerJoin('o.OfficeLicenseDomainInfo', 'oldi')
      .leftJoin('o.Admin', 'admin')
      .offset(offset)
      .limit(limit)
      .orderBy('o.createdAt', 'DESC')
      .withDeleted();

    const licensesCount = await this.licenseGroupInfoRepository
      .createQueryBuilder('o')
      .innerJoin('o.OfficeLicenseDomainInfo', 'oldi')
      .leftJoin('o.Admin', 'admin')
      .withDeleted();

    switch (searchType) {
      case SEARCH_TYPE.OFFICE_LICENSE_NAME:
        licenses.andWhere('o.name like :name', { name: `%${searchValue}%` });
        licensesCount.andWhere('o.name like :name', {
          name: `%${searchValue}%`,
        });
        break;
      case SEARCH_TYPE.AFFILIATION:
        licenses.andWhere('oldi.affiliation like :affiliation', {
          affiliation: `%${searchValue}%`,
        });
        licensesCount.andWhere('oldi.affiliation like :affiliation', {
          affiliation: `%${searchValue}%`,
        });
        break;
      default:
        break;
    }

    // 유효 기간 검색
    if (searchDateTime) {
      const searchValueArr = String(searchDateTime).split('|');
      const startedAt = new Date(
        StartedUnixTimestamp(Number(searchValueArr[0])),
      );
      const endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

      licenses.andWhere('o.startedAt >= :startedAt', {
        startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
      });
      licenses.andWhere('o.endedAt <= :endedAt', {
        endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
      });

      licensesCount.andWhere('o.startedAt >= :startedAt', {
        startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
      });
      licensesCount.andWhere('o.endedAt <= :endedAt', {
        endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    // 라이선스 타입 검색
    if (licenseType) {
      licenses.andWhere(`o.licenseType = :licenseType`, {
        licenseType: licenseType,
      });
      licensesCount.andWhere(`o.licenseType = :licenseType`, {
        licenseType: licenseType,
      });
    }

    // 상태 타입 검색
    console.log(stateType);
    if (stateType) {
      if (stateType === AFFILIATION_LICENSE_STATE_TYPE.EXPIRED) {
        licenses.andWhere('o.endedAt < now()');
        licensesCount.andWhere('o.endedAt < now()');
      } else if (stateType === AFFILIATION_LICENSE_STATE_TYPE.IS_USING) {
        licenses.andWhere('o.endedAt > now()');
        licensesCount.andWhere('o.endedAt > now()');
      } else if (stateType === AFFILIATION_LICENSE_STATE_TYPE.WAITING_USE) {
        licenses.andWhere('o.startedAt < now()');
        licensesCount.andWhere('o.startedAt < now()');
      }
    }

    const rows = await licenses.getRawMany();
    const count = await licensesCount.getCount();
    for (const r of rows) {
      r.startedAt = dayjs(r.startedAt).format('YYYY-MM-DD HH:mm:ss');
      r.endedAt = dayjs(r.endedAt).format('YYYY-MM-DD HH:mm:ss');
      r.createdAt = dayjs(r.createdAt).format('YYYY-MM-DD HH:mm:ss');
    }

    return {
      rows,
      count,
    };
  }

  // 라이선스 수정
  async updateLicense(adminId: number, id: number, data: UpdateLicenseDto) {
    // 라이선스 유효성 검증
    const license = await this.licenseGroupInfoRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!license) {
      throw new ForbiddenException('존재하지 않는 라이선스 입니다.');
    }

    if (license.endedAt < new Date()) {
      throw new ForbiddenException('기간이 만료된 라이선스는 변경 불가합니다.');
    }

    const newLicenseGroup = new LicenseGroupInfo();
    newLicenseGroup.id = id;
    newLicenseGroup.expirationDay = data.expirationDay;
    if (data.licenseName) newLicenseGroup.name = data.licenseName;
    if (data.endedAt) newLicenseGroup.endedAt = new Date(data.endedAt);
    if (data.licenseType) newLicenseGroup.licenseType = data.licenseType;
    newLicenseGroup.adminId = adminId;

    // 만료 일자 수정 시
    if (data.expirationDay) {
      const newExpirationAt = new Date(license.startedAt).setDate(
        data.expirationDay,
      );

      // 종료 일시도 수정했을 경우
      if (data.endedAt) {
        if (new Date(data.endedAt) < new Date(newExpirationAt)) {
          newLicenseGroup.expirationDay = null;
        }
        // 종료 일시는 수정 하지 않았을 경우
      } else {
        if (new Date(license.endedAt) < new Date(newExpirationAt)) {
          newLicenseGroup.expirationDay = null;
        }
      }
      // 만료 일자가 null 이거나 undefined 일 경우, 만료일자는 endedAt이다
    } else if (
      data.expirationDay === null ||
      data.expirationDay === undefined
    ) {
      newLicenseGroup.expirationDay = null;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(LicenseGroupInfo)
        .save(newLicenseGroup);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  // 라이선스 삭제
  async deleteLicense(licenseIds: number[]) {
    if (licenseIds.length <= 0) {
      throw new ForbiddenException('삭제 할 아이디가 없습니다.');
    }

    // 라이선스 유효성 검증
    for (const id of licenseIds) {
      const license = await this.licenseGroupInfoRepository
        .createQueryBuilder('o')
        .select(['member.memberId as memberId'])
        .leftJoin('o.LicenseInfos', 'oli')
        .leftJoin('oli.MemberLicenseInfos', 'member')
        .where('o.id= :id', { id })
        .getRawMany();

      if (license.length === 0) {
        throw new ForbiddenException('존재하지 않는 라이선스 입니다.');
      }

      for (const l of license) {
        if (l.memberId) {
          throw new ForbiddenException('사용 중인 회원이 존재 합니다.');
        }
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const id of licenseIds) {
        await queryRunner.manager
          .getRepository(LicenseGroupInfo)
          .delete({ id: id });
      }
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  // 도메인 조회
  async getDomains(_page: number, searchType: string, searchValue: string) {
    const page = _page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    try {
      const domains = await this.officeLicenseDomainInfoRepository
        .createQueryBuilder('o')
        .select([
          'o.id as id',
          'o.affiliation as affiliation',
          'o.domainName as domainName',
          'o.chargeName as chargeName',
          'o.chargePosition as chargePosition',
          'o.chargeEmail as chargeEmail',
          'o.chargePhone as chargePhone',
          'o.createdAt as createdAt',
          'o.id as id',
          'admin.name as adminName',
        ])
        .leftJoin('o.Admin', 'admin')
        .offset(offset)
        .limit(limit)
        .orderBy('o.createdAt', 'DESC');

      const domainsCount = await this.officeLicenseDomainInfoRepository
        .createQueryBuilder('o')
        .leftJoin('o.Admin', 'admin');

      // 검색
      switch (searchType) {
        case SEARCH_TYPE.OFFICE_DOMAIN_NAME: // 오피스 도메인 이름
          domains.andWhere('o.domainName like :domainName', {
            domainName: `%${searchValue}%`,
          });
          domainsCount.andWhere('o.domainName like :domain', {
            domain: `%${searchValue}%`,
          });
          break;
        case SEARCH_TYPE.AFFILIATION: // 오피스 라이선스 이름
          domains.andWhere('o.affiliation like :name', {
            name: `%${searchValue}%`,
          });
          domainsCount.andWhere('o.affiliation like :name', {
            name: `%${searchValue}%`,
          });
          break;
        default:
          break;
      }

      const rows = await domains.getRawMany();
      const count = await domainsCount.getRawMany();

      return {
        rows,
        count: count.length,
      };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('도메인 목록 조회 실패');
    }
  }

  // 도메인 생성
  async createDomain(adminId: number, data: CreateDomainDto) {
    const newDomain = new OfficeLicenseDomainInfo();

    newDomain.affiliation = data.affiliation;
    newDomain.domainName = data.domainName;
    newDomain.chargeName = data.chargeName;
    newDomain.chargePosition = data.chargePosition;
    newDomain.chargeEmail = data.chargeEmail;
    newDomain.chargePhone = data.chargePhone;
    newDomain.adminId = adminId;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(OfficeLicenseDomainInfo)
        .save(newDomain);
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  // 도메인 수정
  async updateDomain(adminId: number, domainId: number, data: UpdateDomainDto) {
    const newDomain = new OfficeLicenseDomainInfo();
    newDomain.id = domainId;
    if (data.affiliation) newDomain.affiliation = data.affiliation;
    if (data.domainName) newDomain.domainName = data.domainName;
    if (data.chargeName) newDomain.chargeName = data.chargeName;
    if (data.chargePosition) newDomain.chargePosition = data.chargePosition;
    if (data.chargeEmail) newDomain.chargeEmail = data.chargeEmail;
    if (data.chargePhone) newDomain.chargePhone = data.chargePhone;
    newDomain.adminId = adminId;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(OfficeLicenseDomainInfo)
        .save(newDomain);
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  // 도메인 삭제 ( 사용 금지 )
  async deleteDomain(adminId: number, domainIds: number[]) {
    for (const id of domainIds) {
      const domain = await this.officeLicenseDomainInfoRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!domain) {
        throw new ForbiddenException('존재하지 않는 도메인 입니다.');
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const id of domainIds) {
        await queryRunner.manager
          .getRepository(OfficeLicenseDomainInfo)
          .delete({ id: id });
      }
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  // 라이선스 상수 조회
  async getConstants() {
    const licenseType = await this.dataSource.getRepository(LicenseType).find();

    return {
      licenseType,
    };
  }

  async test() {
    const myRequest = await this.dataSource
      .getRepository(MemberFriendRequest)
      .createQueryBuilder('f')
      .select(['f.createdAt as createdAt'])
      .where('f.requestMemberId = :memberId', {
        memberId: '1593b800-9b1e-11ed-9bd3-93e73d4c0b2d',
      })
      .limit(100)
      .orderBy('f.createdAt', 'DESC')
      .getRawMany();

    console.log(myRequest);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (myRequest.length > 2) {
        const deletedAt = myRequest[1].createdAt;
        await queryRunner.manager.getRepository(MemberFriendRequest).delete({
          requestMemberId: '1593b800-9b1e-11ed-9bd3-93e73d4c0b2d',
          createdAt: deletedAt,
        });

        await queryRunner.commitTransaction();

        const result = await this.dataSource
          .getRepository(MemberFriendRequest)
          .createQueryBuilder('f')
          .where('f.requestMemberId = :memberId', {
            memberId: '1593b800-9b1e-11ed-9bd3-93e73d4c0b2d',
          })
          .getRawMany();

        console.log(result);
      }
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    // try {
    //   // 라이선스 키 생성
    //   await this.generateLicense(50, 4, queryRunner);

    //   await queryRunner.commitTransaction();
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }
  }

  async coupon() {
    const generator = [];

    for (let i = 0; i < 300; i++) {
      generator.push(couponCode.generate());
    }

    return generator;
  }
}
