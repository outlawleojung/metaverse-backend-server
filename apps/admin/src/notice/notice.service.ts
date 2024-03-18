import { ADMIN_PAGE } from '@libs/constants';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { GetNoticesDto } from './dto/req/get.notices.dto';
import { NoticeExposureType, NoticeInfo, NoticeType } from '@libs/entity';
import { CreateNoticeDto } from './dto/req/create.notice.dto';
import { UpdateNoticeDto } from './dto/req/update.notice.dto';
import dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeInfo)
    private readonly noticeInfoRepository: Repository<NoticeInfo>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  getConstants = async () => {
    try {
      const noticeType = await this.dataSource.getRepository(NoticeType).find();
      const noticeExposureType = await this.dataSource
        .getRepository(NoticeExposureType)
        .find();

      return { noticeType, noticeExposureType };
    } catch (error) {}
  };

  getNotices = async (data: GetNoticesDto) => {
    const page = data.page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    try {
      const notices = await this.noticeInfoRepository
        .createQueryBuilder('n')
        .select([
          'n.id as id',
          'n.noticeType as noticeType',
          'noticeType.name as noticeTypeName',
          'n.subject as subject',
          'n.startedAt as startedAt',
          'n.endedAt as endedAt',
          'n.createdAt as createdAt',
          'admin.name as adminName',
        ])
        .addSelect(
          `CASE
        WHEN n.enLink IS NULL then '한국어'
        ELSE '한국어/영어' 
      END`,
          'language',
        )
        .addSelect(
          `CASE
        WHEN n.endedAt > now() and n.startedAt < now() then '활성화(게시 중)'
        ELSE '비활성화' 
      END`,
          'stateTypeName',
        )
        .leftJoin('n.Admin', 'admin')
        .innerJoin('n.NoticeType', 'noticeType')
        .offset(offset)
        .limit(limit)
        .orderBy('n.createdAt', 'DESC');

      const noticeCount =
        await this.noticeInfoRepository.createQueryBuilder('n');

      if (data.noticeType && data.noticeType > 0) {
        notices.andWhere('n.noticeType = :noticeType', {
          noticeType: data.noticeType,
        });
        noticeCount.andWhere('n.noticeType = :noticeType', {
          noticeType: data.noticeType,
        });
      }
      const rows = await notices.getRawMany();
      const count = await noticeCount.getCount();

      return { rows, count };
    } catch (error) {
      console.log(error);
      throw new Error('DB Failed');
    }
  };

  // 공지 사항 항목 조회
  getNotice = async (id: number) => {
    try {
      const notice = await this.noticeInfoRepository
        .createQueryBuilder('n')
        .select([
          'n.id as id',
          'n.noticeType as noticeType',
          'noticeType.name as noticeTypeName',
          'n.noticeExposureType as noticeExposureType',
          'noticeExposureType.name as NoticeExposureTypeName',
          'n.subject as subject',
          'n.koLink as koLink',
          'n.enLink as enLink',
          'n.startedAt as startedAt',
          'n.endedAt as endedAt',
          'n.createdAt as createdAt',
        ])
        .leftJoin('n.Admin', 'admin')
        .innerJoin('n.NoticeType', 'noticeType')
        .innerJoin('n.NoticeExposureType', 'noticeExposureType')
        .where('n.id = :id', { id })
        .getRawOne();

      return notice;
    } catch (error) {
      console.log(error);
      throw new Error('DB Failed');
    }
  };

  createNotice = async (adminId: number, data: CreateNoticeDto) => {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 시작, 종료 일시 체크
      const currentDate = new Date();

      const startedAt = new Date(data.startedAt);

      const endedAt = new Date(data.endedAt);
      console.log('종료 시간 : ', dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'));
      console.log(
        '현재 시간 : ',
        dayjs(currentDate).format('YYYY-MM-DD HH:mm:ss'),
      );
      console.log(
        '시작 시간 : ',
        dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
      );

      // 중복 체크

      const existsNotice = await this.noticeInfoRepository.findOne({
        where: [
          {
            startedAt: LessThanOrEqual(endedAt),
            endedAt: MoreThanOrEqual(startedAt),
            noticeType: data.noticeType,
          },
        ],
      });
      // const existsNotice = await this.noticeInfoRepository
      //   .createQueryBuilder('notice')
      //   .where('notice.startedAt < :endedAt AND notice.endedAt > :startedAt', {
      //     startedAt,
      //     endedAt,
      //   })
      //   .andWhere('notice.noticeType = :noticeType', { noticeType: data.noticeType })
      //   .getOne();

      if (existsNotice) {
        throw new ForbiddenException('날짜가 기존 공지사항과 중복 됩니다.');
      }

      if (currentDate > startedAt) {
        throw new ForbiddenException('시작 시간은 현재 시간보다 커야 합니다.');
      }

      if (endedAt < startedAt) {
        throw new ForbiddenException('종료 시간은 시작 시간보다 커야 합니다.');
      }

      const notice = new NoticeInfo();
      notice.subject = data.subject;
      notice.noticeType = data.noticeType;
      notice.noticeExposureType = data.noticeExposureType;
      notice.startedAt = startedAt;
      notice.endedAt = endedAt;
      notice.koLink = data.koLink;
      if (data.enLink) notice.enLink = data.enLink;
      notice.adminId = adminId;

      await queryRunner.manager.getRepository(NoticeInfo).save(notice);
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof ForbiddenException) {
        throw error;
      } else {
        return false;
      }
    } finally {
      await queryRunner.release();
    }
  };

  updateNotice = async (
    adminId: number,
    noticeId: number,
    data: UpdateNoticeDto,
  ) => {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const exNotice = await this.noticeInfoRepository.findOne({
        where: {
          id: noticeId,
        },
      });

      if (!exNotice) {
        throw new ForbiddenException('존재하지 않는 공지사항 입니다.');
      }

      // 시작, 종료 일시 체크
      const currentDate = new Date();
      const startedAt = data.startedAt ? new Date(data.startedAt) : null;
      const endedAt = data.endedAt ? new Date(data.endedAt) : null;

      if (startedAt && endedAt) {
        if (endedAt < startedAt) {
          throw new ForbiddenException(
            '종료 시간은 시작 시간보다 커야 합니다.',
          );
        }

        if (currentDate > startedAt) {
          throw new ForbiddenException(
            '시작 시간은 현재 시간보다 커야 합니다.',
          );
        }
      } else if (startedAt) {
        if (currentDate > startedAt) {
          throw new ForbiddenException(
            '시작 시간은 현재 시간보다 커야 합니다.',
          );
        }

        const cEndedAt = new Date(exNotice.endedAt);

        if (cEndedAt < startedAt) {
          throw new ForbiddenException(
            '시작 시간은 종료 시간보다 작아야 합니다.',
          );
        }
      } else if (endedAt) {
        const cStartedAt = new Date(exNotice.startedAt);

        if (endedAt < cStartedAt) {
          throw new ForbiddenException(
            '종료 시간은 시작 시간보다 커야 합니다.',
          );
        }
      }

      const notice = new NoticeInfo();
      if (data.subject) notice.subject = data.subject;
      if (data.noticeType) notice.noticeType = data.noticeType;
      if (data.noticeExposureType)
        notice.noticeExposureType = data.noticeExposureType;
      if (data.koLink && data.koLink.length > 0) notice.koLink = data.koLink;
      if (data.enLink && data.enLink.length > 0) notice.enLink = data.enLink;
      if (data.startedAt) notice.startedAt = startedAt;
      if (data.endedAt) notice.endedAt = endedAt;
      notice.adminId = adminId;

      await queryRunner.manager
        .getRepository(NoticeInfo)
        .update({ id: noticeId }, notice);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof ForbiddenException) {
        throw error;
      } else {
        return false;
      }
    } finally {
      await queryRunner.release();
    }
  };

  deleteNotice = async (noticeId: number) => {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const exNotice = await this.noticeInfoRepository.findOne({
        where: {
          id: noticeId,
        },
      });

      if (!exNotice) {
        throw new ForbiddenException('존재하지 않는 공지사항 입니다.');
      }

      await queryRunner.manager
        .getRepository(NoticeInfo)
        .delete({ id: noticeId });
      await queryRunner.commitTransaction();

      return { noticeId };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof ForbiddenException) {
        throw error;
      } else {
        throw new ForbiddenException('DB Failed');
      }
    } finally {
      await queryRunner.release();
    }
  };
}
