import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BannerInfo,
  BannerReservation,
  ScreenInfo,
  ScreenReservation,
} from '@libs/entity';
import { Repository } from 'typeorm';
import { ScreenBannerGateway } from './screen-banner.gateway';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import {
  NAMESPACE,
  NATS_EVENTS,
  SCREEN_BANNER_SOCKET_S_MESSAGE,
} from '@libs/constants';
import { RequestPayload } from '../packets/packet-interface';

@Injectable()
export class ScreenBannerService {
  private readonly logger = new Logger(ScreenBannerService.name);
  constructor(
    @InjectRepository(ScreenInfo)
    private screenInfoRepository: Repository<ScreenInfo>,
    @InjectRepository(BannerInfo)
    private bannerInfoRepository: Repository<BannerInfo>,
    @InjectRepository(ScreenReservation)
    private screenReservationRepository: Repository<ScreenReservation>,
    @InjectRepository(BannerReservation)
    private bannerReservationRepository: Repository<BannerReservation>,
    private readonly tokenCheckService: TokenCheckService,
    private readonly messageHandler: NatsMessageHandler,
  ) {}

  async handleRequestMessage(client: Socket, payload: RequestPayload) {
    switch (payload.event) {
    }
  }

  async registerSubscribe(server: Server) {
    this.messageHandler.registerHandler(NATS_EVENTS.BANNER, async (message) => {
      this.logger.debug(`배너 구독 콜백 메세지 ✅ \n${message}`);
      await this.bannerCallback(server, message);
    });

    this.messageHandler.registerHandler(NATS_EVENTS.SCREEN, async (message) => {
      this.logger.debug(`스크린 구독 콜백 메세지 ✅ \n${message}`);
      await this.screenCallback(server, message);
    });
  }

  async getScreenList(message: string) {
    const data = JSON.parse(message);

    if (data.type === 'DELTE') {
      return {
        type: data.type,
        id: data.id,
      };
    } else {
      try {
        const screenInfo = await this.screenInfoRepository.find();

        const screenIds = screenInfo.map((screen) => screen.id);

        const query = await this.screenReservationRepository
          .createQueryBuilder('s')
          .select([
            's.id AS id',
            's.screenId as screenId',
            's.screenContentType as screenContentType',
            's.contents as contents',
            's.startedAt as startedAt',
            's.endedAt as endedAt',
            'TIMESTAMPDIFF(SECOND, NOW(), s.startedAt) AS "remainingStartSeconds"',
            // 현재 시간으로부터 endedAt까지 남은 시간(초) 계산
            'TIMESTAMPDIFF(SECOND, NOW(), s.endedAt) AS "remainingEndSeconds"',
            'NOW() as now',
          ])
          .where('s.endedAt > NOW()');

        if (data.type === 'UPDATE' || data.type === 'CREATE') {
          await query.andWhere('s.id = :id', { id: data.id });
        } else {
          await query.andWhere('s.screenId IN (:...screenIds)', { screenIds });
        }

        const screenReservations = await query.getRawMany();

        return {
          type: data.type,
          screenReservations,
        };
      } catch (error) {
        console.log(error);
      }
    }
  }

  async screenCallback(server: Server, message: string) {
    this.logger.debug(`스크린 구독 콜백 실행 ⚠ \n${message}`);

    const returnData = await this.getScreenList(message);
    server
      .to(NAMESPACE.SCREEN_BANNER)
      .emit(
        SCREEN_BANNER_SOCKET_S_MESSAGE.S_SCREEN_LIST,
        JSON.stringify(returnData),
      );
  }

  async getBannerList(message: string) {
    const data = JSON.parse(message);

    if (data.type === 'DELTE') {
      return {
        type: data.type,
        id: data.id,
      };
    } else {
      try {
        const bannerInfo = await this.bannerInfoRepository.find();

        const bannerIds = bannerInfo.map((banner) => banner.id);

        const query = await this.bannerReservationRepository
          .createQueryBuilder('br')
          .select([
            'br.id AS id',
            'br.bannerId AS bannerId',
            'br.uploadType AS uploadType',
            'br.contents AS contents',
            'br.startedAt AS startedAt',
            'br.endedAt AS endedAt',
            'TIMESTAMPDIFF(SECOND, NOW(), br.startedAt) AS "remainingStartSeconds"',
            'TIMESTAMPDIFF(SECOND, NOW(), br.endedAt) AS "remainingEndSeconds"',
          ])

          .where('br.endedAt > NOW()');

        if (data.type === 'UPDATE') {
          await query.andWhere('br.id = :id', { id: data.id });
        } else if (data.type === 'CREATE') {
          await query.andWhere('br.id IN (:...ids)', { ids: data.id });
        } else {
          await query.andWhere('br.bannerId IN (:...bannerIds)', { bannerIds });
        }

        const bannerReservations = await query.getRawMany();

        return {
          type: data.type,
          bannerReservations,
        };
      } catch (error) {
        console.log(error);
      }
    }
  }

  async bannerCallback(server: Server, message: string) {
    this.logger.debug(`배너 구독 콜백 메세지 ☢ \n${message}`);

    const returnData = await this.getBannerList(message);
    server
      .to('screen-banner')
      .emit(
        SCREEN_BANNER_SOCKET_S_MESSAGE.S_BANNER_LIST,
        JSON.stringify(returnData),
      );
  }
}
