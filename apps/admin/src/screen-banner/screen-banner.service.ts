import {
  BannerInfo,
  BannerReservation,
  FunctionTable,
  MediaRollingType,
  ScreenContentType,
  ScreenInfo,
  ScreenReservation,
  SpaceDetailType,
  SpaceInfo,
  SpaceType,
  UploadType,
  BannerType,
} from '@libs/entity';
import {
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  Repository,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { CreateScreenReservationDTO } from './dto/req/create.screen.dto';
import { CreateBannerReservationDTO } from './dto/req/create.banner.dto';
import { UpdateBannerReservationDTO } from './dto/req/update.banner.dto';
import { UpdateScreenReservationDTO } from './dto/req/update.screen.dto';
import { GetScreenBannerDTO } from './dto/req/get.screen.dto';
import {
  ADMIN_PAGE,
  FUNCTION_TABLE,
  MEDIA_ROLLING_TYPE,
  SCREEN_CONTENT_TYPE,
} from '@libs/constants';
import { NatsService } from '../nats/nats.service';

@Injectable()
export class ScreenBannerService {
  constructor(
    @InjectRepository(ScreenReservation)
    private screenReservationRespository: Repository<ScreenReservation>,
    @InjectRepository(BannerReservation)
    private bannerReservationRepository: Repository<BannerReservation>,
    private readonly natsService: NatsService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(ScreenBannerService.name);

  async getConstants() {
    const uploadType = await this.dataSource.getRepository(UploadType).find();
    const screenContentType = await this.dataSource
      .getRepository(ScreenContentType)
      .find();
    const spaceDetailType = await this.dataSource
      .getRepository(SpaceDetailType)
      .find();
    const spaceType = await this.dataSource.getRepository(SpaceType).find();
    const spaceInfo = await this.dataSource.getRepository(SpaceInfo).find();
    const mediaRollingType = await this.dataSource
      .getRepository(MediaRollingType)
      .find();
    const bannerType = await this.dataSource.getRepository(BannerType).find();

    const screenRollingMaxCount = await this.dataSource
      .getRepository(FunctionTable)
      .findOne({
        where: {
          id: FUNCTION_TABLE.SCREEN_ROLLING_MAX_COUNT,
        },
      });

    const bannerRollingMaxCount = await this.dataSource
      .getRepository(FunctionTable)
      .findOne({
        where: {
          id: FUNCTION_TABLE.BANNER_ROLLING_MAX_COUNT,
        },
      });

    return {
      uploadType,
      screenContentType,
      spaceInfo,
      spaceType,
      spaceDetailType,
      mediaRollingType,
      bannerType,
      screenRollingMaxCount: screenRollingMaxCount.value,
      bannerRollingMaxCount: bannerRollingMaxCount.value,
    };
  }

  async getScreenReservations(data: GetScreenBannerDTO) {
    const page = data?.page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    try {
      const currentDate = new Date();

      const screenInfos = await this.dataSource
        .getRepository(ScreenInfo)
        .createQueryBuilder('si')
        .select([
          'si.id as screenId',
          'si.spaceType as spaceType',
          'si.spaceDetailType as spaceDetailType',
          'si.positionImage as positionImage',
          'si.mediaRollingType as mediaRollingType',
        ])
        .offset(offset)
        .limit(limit);

      const screenInfosCount = await this.dataSource
        .getRepository(ScreenInfo)
        .createQueryBuilder('si');

      if (data.spaceType) {
        screenInfos.andWhere('si.spaceType = :spaceType', {
          spaceType: Number(data.spaceType),
        });

        screenInfosCount.andWhere('si.spaceType = :spaceType', {
          spaceType: Number(data.spaceType),
        });

        if (data.spaceDetailType) {
          screenInfos.andWhere('si.spaceDetailType = :spaceDetailType', {
            spaceDetailType: Number(data.spaceDetailType),
          });

          screenInfosCount.andWhere('si.spaceDetailType = :spaceDetailType', {
            spaceDetailType: Number(data.spaceDetailType),
          });
        }
      }

      const rows = await screenInfos.getRawMany();
      const count = await screenInfosCount.getCount();

      for (const si of rows) {
        // 현재 진행 중인 screen을 조회합니다.
        let currentScreen = await this.dataSource
          .getRepository(ScreenReservation)
          .createQueryBuilder('sr')
          .leftJoin('sr.Admin', 'admin')
          .select([
            'sr.id as reservId',
            'sr.screenId as screenId',
            'sr.contents as contents',
            'admin.name as adminName',
            'sr.startedAt as startedAt',
            'sr.endedAt as endedAt',
          ])
          .where({
            startedAt: LessThanOrEqual(currentDate),
            endedAt: MoreThanOrEqual(currentDate),
          })
          .andWhere('sr.screenId = :screenId', { screenId: si.screenId })
          .orderBy('sr.startedAt', 'DESC')
          .getRawOne();

        // 현재 진행 중인 screen이 없다면 진행 예정인 screen을 조회합니다.
        if (!currentScreen) {
          currentScreen = await this.dataSource
            .getRepository(ScreenReservation)
            .createQueryBuilder('sr')
            .leftJoin('sr.Admin', 'admin')
            .select([
              'sr.id as reservId',
              'sr.screenId as screenId',
              'sr.contents as contents',
              'admin.name as adminName',
              'sr.startedAt as startedAt',
              'sr.endedAt as endedAt',
            ])
            .where({
              startedAt: MoreThanOrEqual(currentDate),
            })
            .andWhere('sr.screenId = :screenId', { screenId: si.screenId })
            .orderBy('sr.startedAt', 'ASC')
            .getRawOne();
        }

        console.log('@@@@@@@@@@@@@@ currentScreen : ');
        console.log(currentScreen);

        si.reservId = currentScreen ? currentScreen.reservId : null;
        si.contents = currentScreen ? currentScreen.contents : null;
        si.adminName = currentScreen ? currentScreen.adminName : null;
        si.startedAt = currentScreen ? currentScreen.startedAt : null;
        si.endedAt = currentScreen ? currentScreen.endedAt : null;
      }

      rows.sort((a, b) => {
        return b.startedAt - a.startedAt;
      });

      return { rows, count };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }

  async createScreenReservation(
    adminId: number,
    data: CreateScreenReservationDTO,
  ) {
    const screenId = data.screenId;
    const screenContentType = data.screenContentType;
    const contents = data.contents;
    const description = data.description;
    const startedAt = new Date(data.startedAt);
    const endedAt = new Date(data.endedAt);
    const currentDate = new Date();

    const screenInfo = await this.dataSource.getRepository(ScreenInfo).findOne({
      where: {
        id: screenId,
      },
    });

    const screenRollingMaxCount = await this.dataSource
      .getRepository(FunctionTable)
      .findOne({
        where: {
          id: FUNCTION_TABLE.SCREEN_ROLLING_MAX_COUNT,
        },
      });

    // 롤링 타입이 단일 일 경우
    if (screenInfo.mediaRollingType === MEDIA_ROLLING_TYPE.SINGLE) {
      // 비디오 갯수가 1개 이상이면
      if (data.contents && data.contents.length > 1) {
        throw new ForbiddenException('비디오 갯수 초과');
      }
      // 롤링 타입이 복수 일 경우
    } else {
      // 비디오 갯수가 최대 갯수보다 크면
      if (data.contents && screenRollingMaxCount.value < data.contents.length) {
        throw new ForbiddenException('비디오 갯수 초과');
      }
    }

    if (startedAt <= new Date()) {
      throw new ForbiddenException('시작 일시 설정 오류!');
    }

    if (endedAt <= currentDate) {
      throw new ForbiddenException('종료 시간 설정 오류');
    }

    // 유튜브 라이브 인 경우
    if (screenContentType === SCREEN_CONTENT_TYPE.YOUTUBU_LIVE) {
      // 해당 배너에 예약과 겹치는 유튜브 라이브가 있는지 확인
      const reservations = await this.screenReservationRespository
        .createQueryBuilder('reservation')
        .where('reservation.screenId = :screenId', { screenId })
        .andWhere('reservation.screenContentType = :contentType', {
          contentType: SCREEN_CONTENT_TYPE.YOUTUBU_LIVE,
        })
        .andWhere('reservation.startedAt <= :endedAt', { endedAt })
        .andWhere('reservation.endedAt >= :startedAt', { startedAt })
        .getRawMany();

      // 예약이 있는 경우 ( 시간 비교 필요 )
      if (reservations.length > 0) {
        throw new ForbiddenException('이미 예약이 있음');
      }
    }
    // 유튜브 라이브가 아닌 경우
    else {
      // 해당 배너에 예약과 겹치는지 확인
      const reservations = await this.screenReservationRespository.find({
        where: {
          screenId: screenId,
          startedAt: LessThanOrEqual(endedAt),
          endedAt: MoreThanOrEqual(startedAt),
        },
      });

      // 예약이 있는 경우 ( 시간 비교 필요 )
      if (reservations.length > 0) {
        throw new ForbiddenException('이미 예약이 있음');
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const screenReservation = new ScreenReservation();
    screenReservation.screenId = screenId;
    screenReservation.screenContentType = screenContentType;
    screenReservation.contents = JSON.stringify(contents);
    screenReservation.description = description;
    screenReservation.adminId = adminId;
    screenReservation.startedAt = startedAt;
    screenReservation.endedAt = endedAt;

    try {
      await queryRunner.manager.save(screenReservation);
      await queryRunner.commitTransaction();

      const _data = JSON.stringify({
        type: 'CREATE',
        id: screenReservation.id,
      });
      await this.natsService.publish('SCREEN', _data);

      return HttpStatus.OK;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    } finally {
      await queryRunner.release();
    }
  }

  async updateScreenReservation(
    adminId: number,
    data: UpdateScreenReservationDTO,
    reservId: number,
  ) {
    // 기존 예약 정보와 시간 확인
    const reservation = await this.screenReservationRespository.findOne({
      where: {
        id: reservId,
      },
    });

    if (!reservation) {
      throw new Error('스크린 예약 정보가 없습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const screenInfo = await this.dataSource.getRepository(ScreenInfo).findOne({
      where: {
        id: reservation.screenId,
      },
    });

    const screenRollingMaxCount = await this.dataSource
      .getRepository(FunctionTable)
      .findOne({
        where: {
          id: FUNCTION_TABLE.SCREEN_ROLLING_MAX_COUNT,
        },
      });

    if (data.contents && data.contents.length > 0) {
      // 롤링 타입이 단일 일 경우
      if (screenInfo.mediaRollingType === MEDIA_ROLLING_TYPE.SINGLE) {
        // 비디오 갯수가 1개 이상이면
        if (data.contents.length > 1) {
          throw new ForbiddenException('비디오 갯수 초과');
        }
        // 롤링 타입이 복수 일 경우
      } else {
        // 비디오 갯수가 최대 갯수보다 크면
        if (
          data.contents &&
          screenRollingMaxCount.value < data.contents.length
        ) {
          throw new ForbiddenException('비디오 갯수 초과');
        }
      }
    }

    // 시작 시간과 종료 시간 수정인 경우
    if (data.startedAt && data.endedAt) {
      const startedAt = new Date(data.startedAt);
      const endedAt = new Date(data.endedAt);

      if (startedAt >= reservation.endedAt) {
        throw new ForbiddenException('시작 시간 설정 오류');
      }

      if (endedAt <= reservation.startedAt) {
        throw new ForbiddenException('종료 시간 설정 오류');
      }

      // 해당 배너에 예약과 겹치는지 확인
      const reservations = await queryRunner.manager
        .getRepository(ScreenReservation)
        .find({
          where: {
            id: Not(reservId),
            screenId: reservation.screenId,
            startedAt: LessThanOrEqual(endedAt),
            endedAt: MoreThanOrEqual(startedAt),
          },
        });

      // 예약이 있는 경우 ( 시간 비교 필요 )
      if (reservations.length > 0) {
        throw new ForbiddenException('이미 예약이 있음');
      }
    }

    // 시작 시간 수정인 경우
    if (data.startedAt) {
      const startedAt = new Date(data.startedAt);
      if (startedAt >= reservation.endedAt) {
        throw new ForbiddenException('시작 시간 설정 오류');
      }
      // 해당 배너에 예약과 겹치는지 확인
      const reservations = await queryRunner.manager
        .getRepository(ScreenReservation)
        .find({
          where: {
            id: Not(reservId),
            screenId: reservation.screenId,
            startedAt: LessThanOrEqual(reservation.endedAt),
            endedAt: MoreThanOrEqual(startedAt),
          },
        });

      // 예약이 있는 경우 ( 시간 비교 필요 )
      if (reservations.length > 0) {
        throw new ForbiddenException('이미 예약이 있음');
      }
    }

    // 종료 시간 수정인 경우
    if (data.endedAt) {
      const endedAt = new Date(data.endedAt);
      if (endedAt <= reservation.startedAt) {
        throw new ForbiddenException('종료 시간 설정 오류');
      }
      // 해당 배너에 예약과 겹치는지 확인
      const reservations = await queryRunner.manager
        .getRepository(ScreenReservation)
        .find({
          where: {
            id: Not(reservId),
            screenId: reservation.screenId,
            startedAt: LessThanOrEqual(endedAt),
            endedAt: MoreThanOrEqual(reservation.startedAt),
          },
        });

      // 예약이 있는 경우 ( 시간 비교 필요 )
      if (reservations.length > 0) {
        throw new ForbiddenException('이미 예약이 있음');
      }
    }

    const screenReservation = new ScreenReservation();

    if (data.contents && data.contents.length > 0)
      screenReservation.contents = JSON.stringify(data.contents);
    if (data.description) screenReservation.description = data.description;
    if (data.startedAt) screenReservation.startedAt = new Date(data.startedAt);
    if (data.endedAt) screenReservation.endedAt = new Date(data.endedAt);
    screenReservation.adminId = adminId;

    try {
      await queryRunner.manager.getRepository(ScreenReservation).update(
        {
          id: reservId,
        },
        screenReservation,
      );
      await queryRunner.commitTransaction();

      const result = await this.screenReservationRespository.findOne({
        where: {
          screenId: reservation.screenId,
        },
      });

      const data = JSON.stringify({ type: 'UPDATE', id: reservId });
      await this.natsService.publish('SCREEN', data);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
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

  async getScreenReservation(screenId: number) {
    try {
      const screenReservation = await this.screenReservationRespository
        .createQueryBuilder('sr')
        .select([
          'sr.id as id',
          'sr.screenId as screenId',
          'sr.screenContentType as screenContentType',
          'sr.contents as contents',
          'sr.description as description',
          'sr.startedAt as startedAt',
          'sr.endedAt as endedAt',
          'sr.createdAt as createdAt',
          'sr.endedAt as endedAt',
          'sr.updatedAt as updatedAt',
          'si.mediaRollingType as mediaRollingType',
          'admin.name as adminName',
        ])
        .leftJoin('sr.Admin', 'admin')
        .leftJoin('sr.ScreenInfo', 'si')
        .where('sr.screenId = :screenId', { screenId: screenId })
        .orderBy('sr.startedAt', 'DESC')
        .getRawMany();

      return screenReservation;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }

  async deleteScreenReservation(reservId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const screenReservation = await this.screenReservationRespository.findOne(
        {
          where: {
            id: reservId,
          },
        },
      );

      if (!screenReservation) {
        throw new ForbiddenException('존재하지 않는 스크린 예약 입니다.');
      }

      await queryRunner.manager.getRepository(ScreenReservation).delete({
        id: reservId,
      });

      await queryRunner.commitTransaction();

      const data = JSON.stringify({ type: 'DELETE', id: reservId });
      await this.natsService.publish('SCREEN', data);

      return { reservId: reservId };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB failed');
    } finally {
      await queryRunner.release();
    }
  }

  async getBannerReservations(data: GetScreenBannerDTO) {
    const page = data?.page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    const currentDate = new Date();
    try {
      const bannerInfos = await this.dataSource
        .getRepository(BannerInfo)
        .createQueryBuilder('bi')
        .select([
          'bi.id as bannerId',
          'bi.spaceType as spaceType',
          'bi.spaceDetailType as spaceDetailType',
          'bi.bannerType as bannerType',
          'bi.positionImage as positionImage',
          'bi.width as width',
          'bi.height as height',
          'bi.mediaRollingType as mediaRollingType',
        ])
        .offset(offset)
        .limit(limit);

      const bannerInfosCount = await this.dataSource
        .getRepository(BannerInfo)
        .createQueryBuilder('bi');

      if (data.spaceType) {
        bannerInfos.andWhere('bi.spaceType = :spaceType', {
          spaceType: Number(data.spaceType),
        });

        bannerInfosCount.andWhere('bi.spaceType = :spaceType', {
          spaceType: Number(data.spaceType),
        });

        if (data.spaceDetailType) {
          bannerInfos.andWhere('bi.spaceDetailType = :spaceDetailType', {
            spaceDetailType: Number(data.spaceDetailType),
          });

          bannerInfosCount.andWhere('bi.spaceDetailType = :spaceDetailType', {
            spaceDetailType: Number(data.spaceDetailType),
          });
        }
      }

      const rows = await bannerInfos.getRawMany();
      const count = await bannerInfosCount.getCount();

      console.log(rows.length);
      console.log(rows);

      for (const bi of rows) {
        // 현재 진행 중인 banner를 조회합니다.
        let currentBanner = await this.dataSource
          .getRepository(BannerReservation)
          .createQueryBuilder('br')
          .leftJoin('br.Admin', 'admin')
          .select([
            'br.id as reservId',
            'br.bannerId as bannerId',
            'br.contents as contents',
            'admin.name as adminName',
            'br.startedAt as startedAt',
            'br.endedAt as endedAt',
          ])
          .where({
            startedAt: LessThanOrEqual(currentDate),
            endedAt: MoreThanOrEqual(currentDate),
          })
          .andWhere('br.bannerId = :bannerId', { bannerId: bi.bannerId })
          .orderBy('br.startedAt', 'DESC')
          .getRawOne();

        // 현재 진행 중인 banner가 없다면 진행 예정인 banner를 조회합니다.
        if (!currentBanner) {
          currentBanner = await this.dataSource
            .getRepository(BannerReservation)
            .createQueryBuilder('br')
            .leftJoin('br.Admin', 'admin')
            .select([
              'br.id as reservId',
              'br.bannerId as bannerId',
              'br.contents as contents',
              'admin.name as adminName',
              'br.startedAt as startedAt',
              'br.endedAt as endedAt',
            ])
            .where({
              startedAt: MoreThanOrEqual(currentDate),
            })
            .andWhere('br.bannerId = :bannerId', { bannerId: bi.bannerId })
            .orderBy('br.startedAt', 'ASC')
            .getRawOne();
        }

        console.log(currentBanner);

        bi.reservId = currentBanner ? currentBanner.reservId : null;
        bi.contents = currentBanner ? currentBanner.contents : null;
        bi.adminName = currentBanner ? currentBanner.adminName : null;
        bi.createdAt = currentBanner ? currentBanner.createdAt : null;
        bi.startedAt = currentBanner ? currentBanner.startedAt : null;
        bi.endedAt = currentBanner ? currentBanner.endedAt : null;
      }

      return { rows, count };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }

  async getBannerReservation(bannerId: number) {
    try {
      const bannerReservation = await this.bannerReservationRepository
        .createQueryBuilder('br')
        .select([
          'br.id as id',
          'br.bannerId as bannerId',
          'br.uploadType as uploadType',
          'br.description as description',
          'br.contents as contents',
          'br.startedAt as startedAt',
          'br.endedAt as endedAt',
          'br.createdAt as createdAt',
          'br.endedAt as endedAt',
          'br.updatedAt as updatedAt',
          'bi.mediaRollingType as mediaRollingType',
          'bi.bannerType as bannerType',
          'admin.name as adminName',
        ])
        .leftJoin('br.Admin', 'admin')
        .leftJoin('br.BannerInfo', 'bi')
        .where('br.bannerId = :bannerId', { bannerId: bannerId })
        .orderBy('br.startedAt', 'DESC')
        .getRawMany();

      return bannerReservation;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }

  async createBannerReservation(
    adminId: number,
    data: CreateBannerReservationDTO,
  ) {
    console.log('################## createBannerReservation');
    const currentDate = new Date();

    console.log('bannerIds : ', data.bannerReservations);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ids = [];
      // 배열로 처리
      for (let index = 0; index < data.bannerReservations.length; index++) {
        const bannerId = data.bannerReservations[index];

        console.log('bannerId : ', bannerId);

        // 해당 배너 존재 여부
        const exBanner = await queryRunner.manager
          .getRepository(BannerInfo)
          .findOne({
            where: {
              id: bannerId,
            },
          });

        console.log('exBanner : ', exBanner);

        if (!exBanner) {
          throw new ForbiddenException('배너 아이디 오류');
        }

        const bannerRollingMaxCount = await this.dataSource
          .getRepository(FunctionTable)
          .findOne({
            where: {
              id: FUNCTION_TABLE.BANNER_ROLLING_MAX_COUNT,
            },
          });

        // 롤링 타입이 단일 일 경우
        if (exBanner.mediaRollingType === MEDIA_ROLLING_TYPE.SINGLE) {
          // 비디오 갯수가 1개 이상이면
          if (data.contents && data.contents.length > 1) {
            throw new ForbiddenException('이미지 갯수 초과');
          }
          // 롤링 타입이 복수 일 경우
        } else {
          // 비디오 갯수가 최대 갯수보다 크면
          if (
            data.contents &&
            bannerRollingMaxCount.value < data.contents.length
          ) {
            throw new ForbiddenException('이미지 갯수 초과');
          }
        }

        // 해당 배너에 예약과 겹치는지 확인
        const startedAt = new Date(data.startedAt);
        const endedAt = new Date(data.endedAt);

        // 시작 시간이 현재 시간 보다 작은 경우
        if (startedAt <= currentDate) {
          throw new ForbiddenException('시작 시간 설정 오류');
        }

        if (startedAt >= endedAt) {
          throw new ForbiddenException('종료 시간 설정 오류');
        }

        // 해당 배너에 예약과 겹치는지 확인
        const reservations = await queryRunner.manager
          .getRepository(BannerReservation)
          .find({
            where: {
              bannerId: bannerId,
              startedAt: LessThanOrEqual(endedAt),
              endedAt: MoreThanOrEqual(startedAt),
            },
          });

        // 예약이 있는 경우 ( 시간 비교 필요 )
        if (reservations.length > 0) {
          throw new ForbiddenException('이미 예약이 있음');
        }

        const banner = new BannerReservation();
        banner.bannerId = bannerId;
        banner.uploadType = data.uploadType;
        banner.description = data.description;
        banner.contents = JSON.stringify(data.contents);
        banner.startedAt = startedAt;
        banner.endedAt = endedAt;
        banner.adminId = adminId;

        await queryRunner.manager.getRepository(BannerReservation).save(banner);

        ids.push(banner.id);
      }

      await queryRunner.commitTransaction();

      const _data = JSON.stringify({ type: 'CREATE', id: ids });
      await this.natsService.publish('BANNER', _data);

      return HttpStatus.OK;
    } catch (err) {
      console.log(err);
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

  async updateBannerReservation(
    adminId: number,
    data: UpdateBannerReservationDTO,
    reservId: number,
  ) {
    // 기존 예약 정보와 시간 확인
    const reservation = await this.bannerReservationRepository.findOne({
      where: {
        id: reservId,
      },
    });

    if (!reservation) {
      throw new ForbiddenException('잘못된 예약 입니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 해당 배너 존재 여부
      const exBanner = await queryRunner.manager
        .getRepository(BannerInfo)
        .findOne({
          where: {
            id: reservation.bannerId,
          },
        });

      const bannerRollingMaxCount = await this.dataSource
        .getRepository(FunctionTable)
        .findOne({
          where: {
            id: FUNCTION_TABLE.BANNER_ROLLING_MAX_COUNT,
          },
        });

      // 롤링 타입이 단일 일 경우
      if (exBanner.mediaRollingType === MEDIA_ROLLING_TYPE.SINGLE) {
        // 비디오 갯수가 1개 이상이면
        if (data.contents && data.contents.length > 1) {
          throw new ForbiddenException('이미지 갯수 초과');
        }
        // 롤링 타입이 복수 일 경우
      } else {
        // 비디오 갯수가 최대 갯수보다 크면
        if (
          data.contents &&
          bannerRollingMaxCount.value < data.contents.length
        ) {
          throw new ForbiddenException('이미지 갯수 초과');
        }
      }

      // 시작 시간과 종료 시간 수정인 경우
      if (data.startedAt && data.endedAt) {
        const startedAt = new Date(data.startedAt);
        const endedAt = new Date(data.endedAt);

        if (startedAt >= reservation.endedAt) {
          throw new ForbiddenException('시작 시간 설정 오류');
        }

        if (endedAt <= reservation.startedAt) {
          throw new ForbiddenException('종료 시간 설정 오류');
        }

        // 해당 배너에 예약과 겹치는지 확인
        const reservations = await queryRunner.manager
          .getRepository(BannerReservation)
          .find({
            where: {
              id: Not(reservId),
              bannerId: reservation.bannerId,
              startedAt: LessThanOrEqual(endedAt),
              endedAt: MoreThanOrEqual(startedAt),
            },
          });

        // 예약이 있는 경우 ( 시간 비교 필요 )
        if (reservations.length > 0) {
          throw new ForbiddenException('이미 예약이 있음');
        }
      }

      // 시작 시간 수정인 경우
      if (data.startedAt) {
        const startedAt = new Date(data.startedAt);
        if (startedAt >= reservation.endedAt) {
          throw new ForbiddenException('시작 시간 설정 오류');
        }
        // 해당 배너에 예약과 겹치는지 확인
        const reservations = await queryRunner.manager
          .getRepository(BannerReservation)
          .find({
            where: {
              id: Not(reservId),
              bannerId: reservation.bannerId,
              startedAt: LessThanOrEqual(reservation.endedAt),
              endedAt: MoreThanOrEqual(startedAt),
            },
          });

        // 예약이 있는 경우 ( 시간 비교 필요 )
        if (reservations.length > 0) {
          throw new ForbiddenException('이미 예약이 있음');
        }
      }

      // 종료 시간 수정인 경우
      if (data.endedAt) {
        const endedAt = new Date(data.endedAt);
        if (endedAt <= reservation.startedAt) {
          throw new ForbiddenException('종료 시간 설정 오류');
        }
        // 해당 배너에 예약과 겹치는지 확인
        const reservations = await queryRunner.manager
          .getRepository(BannerReservation)
          .find({
            where: {
              id: Not(reservId),
              bannerId: reservation.bannerId,
              startedAt: LessThanOrEqual(endedAt),
              endedAt: MoreThanOrEqual(reservation.startedAt),
            },
          });

        // 예약이 있는 경우 ( 시간 비교 필요 )
        if (reservations.length > 0) {
          throw new ForbiddenException('이미 예약이 있음');
        }
      }

      const banner = new BannerReservation();
      if (data.contents && data.contents.length > 0)
        banner.contents = JSON.stringify(data.contents);
      if (data.startedAt) banner.startedAt = new Date(data.startedAt);
      if (data.endedAt) banner.endedAt = new Date(data.endedAt);
      if (data.description || data.description === '')
        banner.description = data.description;
      banner.adminId = adminId;

      await queryRunner.manager.getRepository(BannerReservation).update(
        {
          id: reservId,
        },
        banner,
      );

      await queryRunner.commitTransaction();

      const _data = JSON.stringify({ type: 'UPDATE', id: reservId });
      await this.natsService.publish('BANNER', _data);

      return HttpStatus.OK;
    } catch (err) {
      console.log(err);
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

  async deleteBannerReservation(reservIds: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    console.log('reservIds : ', reservIds);

    const deleteIds = reservIds.split(',').filter(Number).map(Number);

    console.log('deleteIds : ', deleteIds);

    try {
      for (const id of deleteIds) {
        const screenReservation =
          await this.bannerReservationRepository.findOne({
            where: {
              id: id,
            },
          });

        if (!screenReservation) {
          throw new ForbiddenException('존재하지 않는 배너 예약 입니다.');
        }

        await queryRunner.manager.getRepository(BannerReservation).delete({
          id: id,
        });
      }

      await queryRunner.commitTransaction();

      const _data = JSON.stringify({ type: 'DELETE', id: deleteIds });
      await this.natsService.publish('BANNER', _data);

      return { reservIds: deleteIds };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
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
