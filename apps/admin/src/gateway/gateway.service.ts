import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GetTableDto } from '../common/dto/get.table.dto';
import { ROLE_TYPE, SEARCH_TYPE, SERVER_TYPE } from '@libs/constants';
import { ForbiddenException, HttpException } from '@nestjs/common/exceptions';
import {
  Gateway,
  Admin,
  OsType,
  ServerType,
  ServerState,
  StateMessage,
} from '@libs/entity';
import { AddGateWayRegisterDto } from './dto/req/add.gateway.register.dto';
import { EditGateWayDto } from './dto/req/edit.gateway.dto';
import { DeleteGateWayDto } from './dto/req/delete.gateway.dto';
@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(Gateway) private gatewayRepository: Repository<Gateway>,
    @InjectRepository(OsType) private osTypeRepository: Repository<OsType>,
    @InjectRepository(ServerType)
    private serverTypeRepository: Repository<ServerType>,
    @InjectRepository(StateMessage)
    private stateMessageRepository: Repository<StateMessage>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  //게이트웨이 리스트 조회
  async getGatewayList(adminId: number, data: GetTableDto) {
    const page = data?.page ?? 1;
    const limit = 10;
    const offset = 0 + (page - 1) * limit;

    const searchType = data.searchType || '';
    const searchValue = data.searchValue || '';

    const orderType = data.orderType || '';
    const orderValue = data.orderValue || '';

    try {
      const gatewayList = await this.gatewayRepository
        .createQueryBuilder('g')
        .select([
          'g.appVersion',
          'g.osType',
          'g.serverType',
          'g.stateType',
          'g.msgId',
          'g.createdAt',
          'osType.name',
          'serverType.name',
          'serverState.name',
          'stateMessage.message',
          'user.id',
          'user.name',
        ])
        .innerJoin('g.ServerType', 'serverType')
        .innerJoin('g.OsType', 'osType')
        .innerJoin('g.ServerState', 'serverState')
        .innerJoin('g.StateMessage', 'stateMessage')
        .innerJoin('g.Admin', 'user');

      const gatewayCount = await this.gatewayRepository
        .createQueryBuilder('g')
        .select([
          'g.appVersion',
          'g.osType',
          'g.serverType',
          'g.stateType',
          'g.msgId',
          'g.createdAt',
          'user.name',
        ])
        .innerJoin('g.ServerType', 'serverType')
        .innerJoin('g.OsType', 'osType')
        .innerJoin('g.ServerState', 'serverState')
        .innerJoin('g.StateMessage', 'stateMessage')
        .innerJoin('g.Admin', 'user');

      switch (searchType) {
        case SEARCH_TYPE.OS_TYPE:
          gatewayList.andWhere('g.osType = :osType', {
            osType: Number(searchValue),
          });
          gatewayCount.andWhere('g.osType = :osType', {
            osType: Number(searchValue),
          });
          break;
      }

      switch (orderType) {
        case SEARCH_TYPE.CREATED_AT:
          if (orderValue === 'ASC' || orderValue === 'DESC') {
            gatewayList.orderBy('g.createdAt', orderValue);
            gatewayCount.orderBy('g.createdAt', orderValue);
          }
          break;
        case SEARCH_TYPE.APP_VERSION:
          if (orderValue === 'ASC' || orderValue === 'DESC') {
            gatewayList.orderBy('g.appVersion', orderValue);
            gatewayCount.orderBy('g.appVersion', orderValue);
          }
          break;
        default:
          gatewayList.orderBy('g.createdAt', 'DESC');
          break;
      }
      await gatewayList.offset(offset);
      await gatewayList.limit(limit);

      const rows = await gatewayList.getMany();
      const count = await gatewayCount.getCount();

      return { gatewayList: { rows, count } };
    } catch (e) {
      this.logger.error({ e });
      throw new HttpException(e, 500);
    }
  }

  //게이트웨이 추가
  async postGatewayRegister(adminId: number, data: AddGateWayRegisterDto) {
    const osType = data.osType;
    const appVersion = data.appVersion;
    const serverType = data.serverType;
    const stateType = data.serverState;
    const stateMessage = data.stateMessage;
    let msgId = data.msgId;

    if (!msgId && !stateMessage) {
      throw new ForbiddenException('메세지 선택을 해주세요');
    }

    if (msgId && stateMessage) {
      throw new ForbiddenException('하나의 메세지만 선택을 해주세요');
    }

    const gateway = await this.dataSource.getRepository(Gateway).findOne({
      where: {
        osType: osType,
        appVersion: appVersion,
      },
    });

    this.logger.debug({ gateway });
    if (gateway) {
      throw new ForbiddenException('이미 존재하는 앱버전과 OS타입 입니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (stateMessage) {
        // 신규 메세지 추가
        const newMessage = new StateMessage();
        newMessage.message = stateMessage;

        const result = await queryRunner.manager
          .getRepository(StateMessage)
          .save(newMessage);
        console.log(result);
        msgId = result.id;
      }
      const newGateway = new Gateway();
      newGateway.osType = osType;
      newGateway.appVersion = appVersion;
      newGateway.stateType = stateType;
      newGateway.serverType = serverType;
      newGateway.msgId = msgId;
      newGateway.adminId = adminId;

      await queryRunner.manager.getRepository(Gateway).save(newGateway);
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      this.logger.error({ error });
      await queryRunner.rollbackTransaction();

      return false;
    } finally {
      await queryRunner.release();
    }
  }

  //게이트웨이 수정
  async postGatewayEdit(adminId: number, data: EditGateWayDto) {
    const osType = data.osType;
    const appVersion = data.appVersion;
    const serverType = data.serverType;
    const stateType = data.serverState;
    const stateMessage = data.stateMessage;
    let msgId = data.msgId;

    console.log(data);

    if (!msgId && !stateMessage) {
      throw new ForbiddenException('메세지 선택을 해주세요');
    }

    if (msgId && stateMessage) {
      throw new ForbiddenException('하나의 메세지만 선택을 해주세요');
    }

    try {
      const gateway = await this.dataSource.getRepository(Gateway).findOne({
        where: {
          osType: osType,
          appVersion: appVersion,
        },
      });

      if (!gateway) {
        throw new HttpException('존재하지 않는 정보 입니다.', 400);
      }

      // 수정 하려는 서버의 서버타입이 라이브 서버이고 서버타입을 수정하려는 경우
      // (OS별 라이브 서버는 1개 이상 존재)
      if (
        gateway.serverType === SERVER_TYPE.LIVE_SERVER &&
        serverType !== SERVER_TYPE.LIVE_SERVER
      ) {
        const liveServerCount = await this.dataSource
          .getRepository(Gateway)
          .count({
            where: {
              osType: osType,
              serverType: SERVER_TYPE.LIVE_SERVER,
            },
          });

        if (liveServerCount <= 1) {
          throw new ForbiddenException(
            'OS별 LIVE 서버는 1개 이상 있어야 합니다.',
          );
        }
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        if (stateMessage) {
          // 신규 메세지 추가
          const newMessage = new StateMessage();
          newMessage.message = stateMessage;

          const result = await queryRunner.manager
            .getRepository(StateMessage)
            .save(newMessage);
          console.log(result);
          msgId = result.id;
        }

        const gateway = new Gateway();
        gateway.osType = osType;
        gateway.appVersion = appVersion;
        gateway.serverType = serverType;
        gateway.stateType = stateType;
        gateway.msgId = msgId;
        gateway.adminId = adminId;

        console.log(gateway);

        await queryRunner.manager.getRepository(Gateway).save(gateway);
        await queryRunner.commitTransaction();

        return true;
      } catch (error) {
        this.logger.error({ error });
        await queryRunner.rollbackTransaction();
        return false;
      } finally {
        await queryRunner.release();
      }
    } catch (err) {
      this.logger.error({ err });
      throw new ForbiddenException(err);
    }
  }

  //게이트웨이 삭제
  async deleteGateway(adminId: number, data: DeleteGateWayDto) {
    const osType = data.osType;
    const appVersion = data.appVersion;

    const gateway = await this.dataSource.getRepository(Gateway).findOne({
      where: {
        osType: osType,
        appVersion: appVersion,
      },
    });

    if (!gateway) {
      throw new HttpException('존재하지 않는 정보 입니다.', 400);
    }

    // 삭제 하려는 서버의 서버타입이 라이브 서버일 경우
    // (OS별 라이브 서버는 1개 이상 존재)
    if (gateway.serverType === SERVER_TYPE.LIVE_SERVER) {
      const liveServerCount = await this.dataSource
        .getRepository(Gateway)
        .count({
          where: {
            osType: osType,
            serverType: SERVER_TYPE.LIVE_SERVER,
          },
        });

      if (liveServerCount <= 1) {
        throw new ForbiddenException(
          'OS별 LIVE 서버는 1개 이상 있어야 합니다.',
        );
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource.getRepository(Gateway).delete({
        osType,
        appVersion,
      });
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      this.logger.error({ error });
      await queryRunner.rollbackTransaction();

      this.logger.error({ error });

      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async getTypes() {
    try {
      const osType = await this.dataSource.getRepository(OsType).find();
      const serverType = await this.dataSource.getRepository(ServerType).find();
      const serverState = await this.dataSource
        .getRepository(ServerState)
        .find();
      const stateMessage = await this.dataSource
        .getRepository(StateMessage)
        .find();

      return { osType, serverType, serverState, stateMessage };
    } catch (error) {
      this.logger.error({ error });
      throw new ForbiddenException(error);
    }
  }
}
