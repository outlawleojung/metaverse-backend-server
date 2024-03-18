import {
  ADMIN_PAGE,
  REPORT_STATE_TYPE,
  ROLE_TYPE,
  SEARCH_TYPE,
} from '@libs/constants';
import { EndedUnixTimestamp, StartedUnixTimestamp } from '@libs/common';
import {
  MemberReportInfo,
  ReportReasonType,
  ReportType,
  User,
  ReportCategory,
  ReportStateType,
  Member,
  DisciplineReview,
} from '@libs/entity';
import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { DataSource, Repository } from 'typeorm';
import { PatchReportDto } from './dto/req/patch.report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberReportInfo)
    private memberReportInfoRepository: Repository<MemberReportInfo>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(ReportService.name);

  // 신고 타입 상수 조회
  async getConstant() {
    const reportType = await this.dataSource.getRepository(ReportType).find();
    const reasonType = await this.dataSource
      .getRepository(ReportReasonType)
      .find();
    const reportCategory = await this.dataSource
      .getRepository(ReportCategory)
      .find();
    const reportStateType = await this.dataSource
      .getRepository(ReportStateType)
      .find();

    return { reportType, reasonType, reportCategory, reportStateType };
  }

  async getReports(
    adminId: number,
    _page: number,
    searchType: string,
    searchValue: string,
    searchDateTime: string,
    reportType: number,
    reasonType: number,
    stateType: number,
  ) {
    const admin = await this.userRepository.findOne({
      where: {
        id: adminId,
      },
    });

    if (admin.roleType >= ROLE_TYPE.UNAUTHORIZED) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const page = _page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    try {
      const reports = await this.memberReportInfoRepository
        .createQueryBuilder('m')
        .select([
          'm.id as id',
          'm.reportedAt as reportedAt',
          'm.stateType as stateType',
          'stateType.name as stateTypeName',
          'm.reportType as reportType',
          'reportType.name as reportTypeName',
          'reasonType.name as reasonTypeName',
          'm.completedAt as completedAt',
          'admin.name as adminName',
        ])
        .leftJoin('m.ReportCategory', 'category')
        .leftJoin('category.ReportType', 'reportType')
        .leftJoin('category.ReportReasonType', 'reasonType')
        .leftJoin('m.ReportStateType', 'stateType')
        .leftJoin('m.TargetMember', 'tMember')
        .leftJoin('m.Admin', 'admin')
        .orderBy('m.createdAt', 'DESC')
        .offset(offset)
        .limit(limit);

      const reportCount = await this.memberReportInfoRepository
        .createQueryBuilder('m')
        .leftJoin('m.ReportCategory', 'category')
        .leftJoin('m.ReportStateType', 'stateType')
        .leftJoin('m.TargetMember', 'tMember')
        .orderBy('m.createdAt', 'DESC');

      // 검색
      switch (searchType) {
        case SEARCH_TYPE.MEMBER_CODE: // 회원 코드 검색
          reports.andWhere('tMember.memberCode = :memberCode', {
            memberCode: searchValue,
          });
          reportCount.andWhere('tMember.memberCode = :memberCode', {
            memberCode: searchValue,
          });
          break;
        default:
          break;
      }

      // 기간 검색
      if (searchDateTime) {
        const searchValueArr = String(searchDateTime).split('|');
        const startedAt = new Date(
          StartedUnixTimestamp(Number(searchValueArr[0])),
        );
        const endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

        console.log(startedAt);
        console.log(endedAt);

        reports.andWhere('m.createdAt >= :startedAt', {
          startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
        });
        reports.andWhere('m.createdAt <= :endedAt', {
          endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
        });

        reportCount.andWhere('m.createdAt >= :startedAt', {
          startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
        });
        reportCount.andWhere('m.createdAt <= :endedAt', {
          endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
        });
      }

      // 신고 타입 검색
      if (reportType) {
        reports.andWhere(`m.reportType = :reportType`, { reportType });
        reportCount.andWhere(`m.reportType = :reportType`, { reportType });

        if (reasonType) {
          reports.andWhere(`m.reasonType = :reasonType`, { reasonType });
          reportCount.andWhere(`m.reasonType = :reasonType`, { reasonType });
        }
      }

      // 상태 타입 검색
      if (stateType) {
        reports.andWhere(`m.stateType = :stateType`, { stateType: stateType });
        reportCount.andWhere(`m.stateType = :stateType`, {
          stateType: stateType,
        });
      }

      const rows = await reports.getRawMany();
      const count = await reportCount.getRawMany();

      // 신고 접수
      const receiptCount = await this.memberReportInfoRepository
        .createQueryBuilder('m')
        .select(['COUNT(id) as count'])
        .where('m.stateType = :stateType', {
          stateType: REPORT_STATE_TYPE.RECEIPT,
        })
        .getRawOne();

      // 확인 완료
      const completeCount = await this.memberReportInfoRepository
        .createQueryBuilder('m')
        .select(['COUNT(id) as count'])
        .where('m.stateType = :stateType', {
          stateType: REPORT_STATE_TYPE.CONFIRM_COMPLETE,
        })
        .getRawOne();

      // 제재 검토 요청
      const requestCount = await this.memberReportInfoRepository
        .createQueryBuilder('m')
        .select(['COUNT(id) as count'])
        .where('m.stateType = :stateType', {
          stateType: REPORT_STATE_TYPE.REQUEST_RESTRICTION,
        })
        .getRawOne();

      return {
        rows,
        count: count.length,
        stateInfo: {
          receiptCount: parseInt(receiptCount.count, 10),
          completeCount: parseInt(completeCount.count, 10),
          requestCount: parseInt(requestCount.count, 10),
        },
      };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('신고 목록 조회 실패');
    }
  }

  async getReport(adminId: number, reportId: number) {
    // 신고 대상자 정보

    const report = await this.memberReportInfoRepository
      .createQueryBuilder('m')
      .select([
        'm.id as id',
        'm.reportedAt as reportedAt',
        'm.reportType as reportType',
        'reportType.name as reportTypeName',
        'm.reasonType as reasonType',
        'reasonType.name as reasonTypeName',
        'rMember.memberCode as reportMemberCode',
        'm.reportNickname as repportNickname',
        'm.targetNickname as targetNickname',
        'm.targetMemberId as targetMemberId',
        'm.content as content',
        'm.stateType as stateType',
        'm.images as images',
        'm.comment as comment',
      ])
      .innerJoin('m.TargetMember', 'tMember')
      .innerJoin('m.ReportMember', 'rMember')
      .innerJoin('m.ReportCategory', 'category')
      .innerJoin('category.ReportType', 'reportType')
      .innerJoin('category.ReportReasonType', 'reasonType')
      .where('id = :reportId', { reportId })
      .getRawOne();

    const targetMember = await this.memberReportInfoRepository
      .createQueryBuilder('m')
      .select([
        'member.memberCode as memberCode',
        'member.nickname as nickname',
        'COUNT(m.targetMemberId) as count',
        'member.createdAt as createdAt',
        'member.loginedAt as loginedAt',
      ])
      .leftJoin('m.TargetMember', 'member')
      .where('m.targetMemberId = :targetMemberId', {
        targetMemberId: report.targetMemberId,
      })
      .getRawOne();

    targetMember.count = parseInt(targetMember.count, 10);
    return { targetMember, report };
  }

  async patchReport(adminId: number, reportId: number, data: PatchReportDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const report = new MemberReportInfo();
      report.id = reportId;
      report.comment = data.comment;
      report.stateType = data.stateType;
      report.adminId = adminId;

      await queryRunner.manager.getRepository(MemberReportInfo).save(report);
      await queryRunner.commitTransaction();

      return HttpStatus.OK;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB 실패!!');
    } finally {
      await queryRunner.release();
    }
  }

  async getDisciplineList() {
    const disciplines = await this.dataSource
      .getRepository(DisciplineReview)
      .createQueryBuilder('d')
      .select([
        'd.restrictionType as restrictionType',
        'restrictionType.name as restrictionTypeName',
        'd.restrictionDetail as restrictionDetail',
        'restrictionDetail.name as restrictionDetailName',
        'd.disciplineDetail as disciplineDetail',
        'disciplineDetail.name as disciplineDetailName',
      ])
      .innerJoin('d.RestrictionType', 'restrictionType')
      .innerJoin('d.RestrictionDetail', 'restrictionDetail')
      .innerJoin('d.DisciplineDetail', 'disciplineDetail')
      .getRawMany();

    return disciplines;
  }
}
