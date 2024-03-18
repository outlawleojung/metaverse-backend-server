import {
  BannerInfo,
  BannerReservation,
  ScreenContentType,
  ScreenInfo,
  ScreenReservation,
  SpaceDetailType,
  UploadType,
} from '@libs/entity';
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateScreenReservationDTO } from './dto/req/create.screen.dto';

@Injectable()
export class ScreenBannerService {
  constructor(
    @InjectRepository(ScreenReservation)
    private screenReservationRespository: Repository<ScreenReservation>,
    @InjectRepository(BannerReservation)
    private bannerReservationRepository: Repository<BannerReservation>,
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
    const screenInfo = await this.dataSource.getRepository(ScreenInfo).find();
    // const bannerInfo = await this.dataSource.getRepository(BannerInfo).find();

    const screenReservationList = [];

    for (let i = 0; i < screenInfo.length; i++) {
      const screenReservation = await this.screenReservationRespository.findOne(
        {
          where: {
            screenId: screenInfo[i].id,
          },
        },
      );
      if (screenReservation) {
        screenReservationList.push(screenReservation);
      }
    }

    return {
      uploadType,
      screenContentType,
      spaceDetailType,
      screenReservationList,
      screenInfo,
    };
  }

  async getScreenReservation() {
    try {
      const screenInfo = await this.dataSource.getRepository(ScreenInfo).find();
      const screenReservationListArr = [];

      for (let i = 0; i < screenInfo.length; i++) {
        const screenReservationList = await this.screenReservationRespository
          .createQueryBuilder('s')
          .select([
            's.id as id',
            's.screenId as screenId',
            's.screenContentType as screenContentType',
            's.contents as contents',
            's.description as description',
            'admin.id as adminId',
            'admin.name as adminName',
            'screenInfo.spaceDetailType as spaceDetailType',
            'screenInfo.positionImage as positionImage',
            's.startedAt as startedAt',
            's.endedAt as endedAt',
            's.createdAt as createdAt',
            's.updatedAt as updatedAt',
          ])
          .innerJoin('s.ScreenInfo', 'screenInfo')
          .leftJoin('s.Admin', 'admin')
          // .where('s.screenId = :screenId', { screenId: 21101 })
          .where(
            's.screenId = :screenId AND s.startedAt < NOW() AND s.endedAt > NOW()',
            { screenId: screenInfo[i].id },
          )
          // .andWhere(
          //   new Brackets((qb) => {
          //     qb.where('s.startedAt < NOW() AND s.endedAt > NOW()').orWhere('max(s.updatedAt) as s.updatedAt');
          //   }),
          // )
          .groupBy(
            's.id, s.screenId, s.screenContentType, s.contents, s.description, admin.id, admin.name, screenInfo.spaceDetailType, screenInfo.positionImage, s.startedAt, s.endedAt, s.createdAt, s.updatedAt',
          )
          .getRawOne();

        if (screenReservationList) {
          screenReservationListArr.push(screenReservationList);
        } else {
          const screenReservationList = await this.screenReservationRespository
            .createQueryBuilder('s')
            .select([
              's.id as id',
              's.screenId as screenId',
              's.screenContentType as screenContentType',
              's.contents as contents',
              's.description as description',
              'admin.id as adminId',
              'admin.name as adminName',
              'screenInfo.spaceDetailType as spaceDetailType',
              'screenInfo.positionImage as positionImage',
              's.startedAt as startedAt',
              's.endedAt as endedAt',
              's.createdAt as createdAt',
              's.updatedAt as updatedAt',
            ])
            .innerJoin('s.ScreenInfo', 'screenInfo')
            .leftJoin('s.Admin', 'admin')
            .where('s.screenId = :screenId', { screenId: screenInfo[i].id })
            .orderBy('s.updatedAt', 'DESC')
            .groupBy(
              's.id, s.screenId, s.screenContentType, s.contents, s.description, admin.id, admin.name, screenInfo.spaceDetailType, screenInfo.positionImage, s.startedAt, s.endedAt, s.createdAt, s.updatedAt',
            )
            .getRawOne();

          if (screenReservationList) {
            return screenReservationList;
          }
        }
      }

      console.log(screenReservationListArr);

      return screenReservationListArr;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }
}
