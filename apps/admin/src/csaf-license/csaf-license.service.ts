import { ForbiddenException } from '@nestjs/common/exceptions';
import {
  LicenseType,
  LicenseGroupInfo,
  LicenseInfo,
  CSAFEventInfo,
  EventSpaceType,
  CSAFEventEnterLog,
} from '@libs/entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  LessThan,
  Not,
  MoreThan,
  Repository,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import {
  ADMIN_PAGE,
  ALL_LICENSE_STATE_TYPE,
  SEARCH_TYPE,
  EVENT_STATE_TYPE,
  AFFILIATION_LICENSE_STATE_TYPE,
  LICENSE_TYPE,
} from '@libs/constants';
import { StartedUnixTimestamp, EndedUnixTimestamp } from '@libs/common';
import dayjs from 'dayjs';
import { CreateLicenseDto } from './dto/req/create.license.dto';
import { CommonService } from '../common/common.service';
import { CommonService as LibCommonService } from '@libs/common';
import { CreateEventDto } from './dto/req/create.event.dto';
import { UpdateEventDto } from './dto/req/update.event.dto';
import { UpdateLicenseDto } from './dto/req/update.license.dto';

@Injectable()
export class CsafLicenseService {
  constructor(
    @InjectRepository(CSAFEventInfo)
    private csafEventInfoRepository: Repository<CSAFEventInfo>,
    @InjectRepository(LicenseInfo)
    private licenseInfoRepository: Repository<LicenseInfo>,
    @InjectRepository(LicenseGroupInfo)
    private licenseGroupInfoRepository: Repository<LicenseGroupInfo>,
    @Inject(DataSource) private dataSource: DataSource,
    private libCommonService: LibCommonService,
    private commonService: CommonService,
  ) {}
  private readonly logger = new Logger(CsafLicenseService.name);

  // 라이선스 상수 조회
  async getConstants() {
    const licenseType = await this.dataSource.getRepository(LicenseType).find();
    const eventSpaceType = await this.dataSource
      .getRepository(EventSpaceType)
      .find();

    return {
      licenseType,
      eventSpaceType,
    };
  }

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
        'lg.name as licenseName',
        'lg.licenseType as licenseType',
        'lt.name as licenseTypeName',
        'cei.name as eventName',
        'lg.startedAt as startedAt',
        'lg.endedAt as endedAt',
        'mli.createdAt as memberRegiseteredAt',
        'member.memberCode as memberCode',
      ])
      .addSelect(
        `CASE
      WHEN lg.endedAt < now() then ${ALL_LICENSE_STATE_TYPE.EXPIRED}
      WHEN o.isCompleted = 1 then ${ALL_LICENSE_STATE_TYPE.IS_USE_COMPLETED}
      WHEN lg.endedAt > now() and member.memberId IS NOT NULL and o.isCompleted = 0 then ${ALL_LICENSE_STATE_TYPE.IS_USING}
      WHEN member.memberId IS NULL and lg.endedAt > now() and o.isCompleted = 0 then ${ALL_LICENSE_STATE_TYPE.NOT_REGISTERED}
      END`,
        'stateType',
      )
      .addSelect(
        `CASE
        WHEN lg.endedAt < now() then '기간 만료'
        WHEN o.isCompleted = 1 then '사용 완료'
        WHEN lg.endedAt > now() and member.memberId IS NOT NULL and o.isCompleted = 0 then '사용 중'
        WHEN member.memberId IS NULL and lg.endedAt > now() and o.isCompleted = 0 then '미등록'  
      END`,
        'stateTypeName',
      )
      .leftJoin('o.MemberLicenseInfos', 'mli')
      .innerJoin('o.LicenseGroupInfo', 'lg')
      .innerJoin('lg.LicenseType', 'lt')
      .innerJoin('lg.CSAFEventInfo', 'cei')
      .leftJoin('mli.Member', 'member')
      .leftJoin('lg.Admin', 'admin')
      .offset(offset)
      .limit(limit)
      .orderBy('lg.createdAt', 'DESC')
      .withDeleted();

    const licensesCount = await this.licenseInfoRepository
      .createQueryBuilder('o')
      .leftJoin('o.MemberLicenseInfos', 'mli')
      .innerJoin('o.LicenseGroupInfo', 'lg')
      .innerJoin('lg.LicenseType', 'lt')
      .innerJoin('lg.CSAFEventInfo', 'cei')
      .leftJoin('mli.Member', 'member')
      .leftJoin('lg.Admin', 'admin')
      .withDeleted();

    switch (searchType) {
      case SEARCH_TYPE.OFFICE_LICENSE_NAME:
        licenses.andWhere('lg.name like :name', { name: `%${searchValue}%` });
        licensesCount.andWhere('lg.name like :name', {
          name: `%${searchValue}%`,
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
      case SEARCH_TYPE.EVENT_NAME:
        licenses.andWhere('cei.name like :eventName', {
          eventName: `%${searchValue}%`,
        });
        licensesCount.andWhere('cei.name like :eventName', {
          eventName: `%${searchValue}%`,
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

      licenses.andWhere('lg.startedAt >= :startedAt', {
        startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
      });
      licenses.andWhere('lg.endedAt <= :endedAt', {
        endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
      });

      licensesCount.andWhere('lg.startedAt >= :startedAt', {
        startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
      });
      licensesCount.andWhere('lg.endedAt <= :endedAt', {
        endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    // 라이선스 타입 검색
    if (licenseType) {
      licenses.andWhere(`lg.licenseType = :licenseType`, {
        licenseType: licenseType,
      });
      licensesCount.andWhere(`lg.licenseType = :licenseType`, {
        licenseType: licenseType,
      });
    }

    // 상태 타입 검색
    console.log(stateType);
    if (stateType) {
      if (stateType === ALL_LICENSE_STATE_TYPE.EXPIRED) {
        licenses.andWhere('lg.endedAt < now()');
        licensesCount.andWhere('lg.endedAt < now()');
      } else if (stateType === ALL_LICENSE_STATE_TYPE.IS_USE_COMPLETED) {
        licenses.andWhere('o.isCompleted = 1');
        licensesCount.andWhere('o.isCompleted = 1');
      } else if (stateType === ALL_LICENSE_STATE_TYPE.IS_USING) {
        licenses.andWhere(
          'lg.endedAt > now() and member.memberId IS NOT NULL and o.isCompleted = 0',
        );
        licensesCount.andWhere(
          'lg.endedAt > now() and member.memberId IS NOT NULL and o.isCompleted = 0',
        );
      } else if (stateType === ALL_LICENSE_STATE_TYPE.NOT_REGISTERED) {
        licenses.andWhere(
          'member.memberId IS NULL and lg.endedAt > now() and o.isCompleted = 0',
        );
        licensesCount.andWhere(
          'member.memberId IS NULL and lg.endedAt > now() and o.isCompleted = 0',
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

  // 라이선스 관리 목록 조회
  async getManagementLicenses(
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
        'cei.name as eventName',
        'o.licenseType as licenseType',
        'lt.name as licenseTypeName',
        'o.startedAt as startedAt',
        'o.endedAt as endedAt',
        'o.expirationDay as expirationDay',
        'o.issueCount as issueCount',
        'o.useCount as useCount',
        'o.createdAt as createdAt',
        'admin.name as adminName',
        'cei.startedAt as eventStartedAt',
        'cei.endedAt as eventEndedAt',
      ])
      .addSelect(
        `CASE
        WHEN o.startedAt > now() then ${AFFILIATION_LICENSE_STATE_TYPE.WAITING_USE}
        WHEN o.endedAt > now() and o.startedAt < now() then ${AFFILIATION_LICENSE_STATE_TYPE.IS_USING}
        WHEN o.endedAt < now() then ${AFFILIATION_LICENSE_STATE_TYPE.EXPIRED}
        END`,
        'stateType',
      )
      .addSelect(
        `CASE
        WHEN o.startedAt > now() then '사용 대기'
        WHEN o.endedAt > now() and o.startedAt < now() then '사용중'
        WHEN o.endedAt < now() then '기간 만료'
        END`,
        'stateTypeName',
      )
      .innerJoin('o.CSAFEventInfo', 'cei')
      .innerJoin('o.LicenseType', 'lt')
      .leftJoin('o.Admin', 'admin')
      .orderBy('o.createdAt', 'DESC')
      .offset(offset)
      .limit(limit)
      .withDeleted();

    const licensesCount = await this.licenseGroupInfoRepository
      .createQueryBuilder('o')
      .innerJoin('o.CSAFEventInfo', 'cei')
      .innerJoin('o.LicenseType', 'lt')
      .leftJoin('o.Admin', 'admin')
      .orderBy('o.createdAt', 'DESC')
      .withDeleted();

    switch (searchType) {
      case SEARCH_TYPE.OFFICE_LICENSE_NAME:
        licenses.andWhere('o.name like :name', { name: `%${searchValue}%` });
        licensesCount.andWhere('o.name like :name', {
          name: `%${searchValue}%`,
        });
        break;
      case SEARCH_TYPE.EVENT_NAME:
        licenses.andWhere('cei.name like :name', { name: `%${searchValue}%` });
        licensesCount.andWhere('cei.name like :name', {
          name: `%${searchValue}%`,
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
        licenses.andWhere('o.endedAt > now() and o.startedAt < now()');
        licensesCount.andWhere('o.endedAt > now() and o.startedAt < now()');
      } else if (stateType === AFFILIATION_LICENSE_STATE_TYPE.WAITING_USE) {
        licenses.andWhere('o.startedAt > now()');
        licensesCount.andWhere('o.startedAt > now()');
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
        .leftJoin('o.LicenseInfos', 'li')
        .leftJoin('li.MemberLicenseInfos', 'member')
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

  // 라이선스 발급
  async createLicense(adminId: number, data: CreateLicenseDto) {
    // 행사 유효성 검증
    const event = await this.csafEventInfoRepository.findOne({
      where: {
        id: data.eventId,
      },
    });

    if (!event) {
      throw new ForbiddenException('존재하지 않는 행사 입니다.');
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
    newLicenseGroup.eventId = data.eventId;
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
          'olg.name as licenseName',
          'olg.licenseType as licenseType',
          'licenseType.name as licenseTypeName',
          'cei.name as eventName',
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
        .innerJoin('olg.CSAFEventInfo', 'cei')
        .innerJoin('olg.LicenseType', 'licenseType')
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

  // 행사 생성
  async createEvent(adminId: number, data: CreateEventDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const eventInfo = new CSAFEventInfo();

      eventInfo.name = data.name;
      eventInfo.startedAt = new Date(data.startedAt);
      eventInfo.endedAt = new Date(data.endedAt);
      eventInfo.eventSpaceType = data.eventSpaceType;
      eventInfo.adminId = adminId;

      /**
       * 날짜 유효성 검증
       */
      const exEvent = await this.dataSource
        .getRepository(CSAFEventInfo)
        .findOne({
          where: [
            {
              startedAt: LessThanOrEqual(eventInfo.endedAt),
              endedAt: MoreThanOrEqual(eventInfo.startedAt),
            },
          ],
        });

      if (exEvent) {
        throw new ForbiddenException('날짜가 기존 행사와 중복 됩니다.');
      }

      await queryRunner.manager.getRepository(CSAFEventInfo).save(eventInfo);
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof ForbiddenException) {
        throw error;
      } else {
        return false;
      }
    } finally {
      await queryRunner.release();
    }
  }

  // 행사 조회
  async getEvents(
    _page: number,
    searchType: string,
    searchValue: string,
    searchDateTime: string,
    stateType: number,
  ) {
    const page = _page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    try {
      const events = await this.csafEventInfoRepository
        .createQueryBuilder('o')
        .select([
          'o.id as id',
          'o.name as name',
          'o.eventSpaceType as eventSpaceType',
          'eventSpaceType.name as eventSpaceTypeName',
          'o.startedAt as startedAt',
          'o.endedAt as endedAt',
          'o.createdAt as createdAt',
          'admin.name as adminName',
        ])
        .addSelect(
          `CASE
          WHEN o.endedAt < now() then ${EVENT_STATE_TYPE.COMPLETE}
          WHEN o.startedAt > now() then ${EVENT_STATE_TYPE.PREVIOUS}
          ELSE ${EVENT_STATE_TYPE.PROGRESS}
          END`,
          'stateType',
        )
        .addSelect(
          `CASE
          WHEN o.endedAt < now() then '완료'
          WHEN o.startedAt > now() then '진행전'
          ELSE '진행중'
          END`,
          'stateTypeName',
        )
        .leftJoin('o.Admin', 'admin')
        .leftJoin('o.EventSpaceType', 'eventSpaceType')
        .offset(offset)
        .limit(limit)
        .orderBy('o.createdAt', 'DESC');

      const eventsCount = await this.csafEventInfoRepository
        .createQueryBuilder('o')
        .leftJoin('o.Admin', 'admin');

      // 검색
      switch (searchType) {
        case SEARCH_TYPE.EVENT_NAME: // 이벤트 이름
          events.andWhere('o.name like :name', {
            name: `%${searchValue}%`,
          });
          eventsCount.andWhere('o.name like :name', {
            name: `%${searchValue}%`,
          });
          break;
        case SEARCH_TYPE.STATE_TYPE:
          events.andWhere('stateType = :searchValue', {
            searchValue,
          });
          eventsCount.andWhere('stateType = :searchValue', {
            searchValue,
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

        events.andWhere('o.startedAt >= :startedAt', {
          startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
        });
        events.andWhere('o.endedAt <= :endedAt', {
          endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
        });

        eventsCount.andWhere('o.startedAt >= :startedAt', {
          startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
        });
        eventsCount.andWhere('o.endedAt <= :endedAt', {
          endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
        });
      }

      if (stateType) {
        if (stateType === EVENT_STATE_TYPE.COMPLETE) {
          events.andWhere('o.endedAt < now()');
          eventsCount.andWhere('o.endedAt < now()');
        } else if (stateType === EVENT_STATE_TYPE.PREVIOUS) {
          events.andWhere('o.startedAt > now()');
          eventsCount.andWhere('o.startedAt > now()');
        } else if (stateType === EVENT_STATE_TYPE.PROGRESS) {
          events.andWhere('o.endedAt > now() and o.startedAt < now()');
          eventsCount.andWhere('o.endedAt > now() and o.startedAt < now()');
        }
      }

      const rows = await events.getRawMany();
      const count = await eventsCount.getRawMany();

      return {
        rows,
        count: count.length,
      };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('행사 목록 조회 실패');
    }
  }

  // 행사 수정
  async updateEvent(adminId: number, eventId: number, data: UpdateEventDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exEvent = await this.dataSource
        .getRepository(CSAFEventInfo)
        .findOne({
          where: {
            id: eventId,
          },
        });

      if (!exEvent) {
        throw new ForbiddenException('존재 하지 않는 행사 입니다.');
      }

      /**
       * 날짜 유효성 검증
       */
      let startedAt;
      let endedAt;

      // 날짜를 모두 수정한 경우
      if (data.startedAt && data.endedAt) {
        startedAt = new Date(data.startedAt);
        endedAt = new Date(data.endedAt);
      }
      // 시작 날짜를 수정한 경우
      else if (data.startedAt) {
        startedAt = new Date(data.startedAt);
        endedAt = new Date(exEvent.endedAt);
      }
      // 종료 날짜를 수정한 경우
      else if (data.endedAt) {
        startedAt = new Date(exEvent.startedAt);
        endedAt = new Date(data.endedAt);
      }

      // 날짜를 변경 했다면
      if (startedAt && endedAt) {
        const exCheckEvent = await this.dataSource
          .getRepository(CSAFEventInfo)
          .findOne({
            where: [
              { id: Not(eventId), startedAt: Between(startedAt, endedAt) },
              { id: Not(eventId), endedAt: Between(startedAt, endedAt) },
              {
                id: Not(eventId),
                startedAt: LessThan(startedAt),
                endedAt: MoreThan(endedAt),
              },
            ],
          });

        if (exCheckEvent) {
          throw new ForbiddenException('날짜가 기존 행사와 중복 됩니다.');
        }
      }

      const newEvent = new CSAFEventInfo();
      newEvent.id = eventId;
      if (data.name) newEvent.name = data.name;
      if (data.eventSpaceType) newEvent.eventSpaceType = data.eventSpaceType;
      if (data.startedAt) newEvent.startedAt = new Date(data.startedAt);
      if (data.endedAt) newEvent.endedAt = new Date(data.endedAt);
      newEvent.adminId = adminId;

      await queryRunner.manager.getRepository(CSAFEventInfo).save(newEvent);
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

  // 행사 라이선스 목록 조회 - 다운로드용
  async getEventLicense(groupId: number) {
    try {
      const licenses = await this.libCommonService.getEventLicenses(groupId);
      console.log(licenses);
      return licenses;
    } catch (error) {
      console.log(error);
    }
  }

  // 행사 로그
  getEventLog = async (eventId: number) => {
    if (!eventId || isNaN(eventId)) {
      throw new Error('유효하지 않은 eventId 값');
    }

    try {
      // 행사 로비 입장 로그
      const eventLogs =
        await this.libCommonService.getCsafEventEnterLog(eventId);
      const boothLogs =
        await this.libCommonService.getEventBoothInfoLog(eventId);

      console.log('@@@@@@ eventLogs @@@@@@@');
      console.log(eventLogs);
      console.log('@@@@@@ boothLogs @@@@@@@');
      console.log(boothLogs);
      // 부스 정보
      return { eventLogs, boothLogs };
    } catch (error) {
      console.log(error);
    }
  };
}
