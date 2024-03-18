import {
  Gateway,
  OsType,
  ServerInfo,
  ServerState,
  StateMessage,
  TestMember,
} from '@libs/entity';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetGatewayDto } from './dto/get.gateway.dto';
import { ERRORCODE, SERVER_STATE, ERROR_MESSAGE } from '@libs/constants';

@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);
  constructor(
    @InjectRepository(Gateway) private gatewayRepository: Repository<Gateway>,
    @InjectRepository(ServerState)
    private serverStateRepository: Repository<ServerState>,
    @InjectRepository(StateMessage)
    private stateMessageRepository: Repository<StateMessage>,
    @InjectRepository(ServerInfo)
    private serverInfoRepository: Repository<ServerInfo>,
    @InjectRepository(TestMember)
    private testMemberRepository: Repository<TestMember>,
    @InjectRepository(OsType) private osTypeRepository: Repository<OsType>,
  ) {}

  async getGateway(data: GetGatewayDto) {
    try {
      const gateway: any = await this.gatewayRepository.findOne({
        select: ['osType', 'appVersion', 'stateType'],
        relations: ['ServerType', 'OsType', 'ServerState', 'StateMessage'],
        where: {
          appVersion: data.appVersion,
          osType: data.osType,
        },
      });

      // 게이트웨이 정보가 없음.
      if (!gateway) {
        // 업데이트가 필요함.
        const osTypes = await this.osTypeRepository.findOne({
          where: {
            type: data.osType,
          },
        });

        const serverState = await this.serverStateRepository.findOne({
          select: ['state'],
          where: {
            state: SERVER_STATE.NEED_UPDATE,
          },
        });

        const stateMessage = await this.stateMessageRepository.findOne({
          select: ['message'],
          where: {
            id: 2,
          },
        });

        if (osTypes) {
          return {
            OsType: osTypes,
            ServerState: serverState,
            StateMessage: stateMessage,
            error: ERRORCODE.NET_E_NEED_UPDATE,
          };
        }
      }
      // 게이트웨이 정보는 있음.
      else {
        // 비활성 ( 점검중임 )
        if (gateway.stateType === SERVER_STATE.INACTIVATE) {
          gateway.ServerType.ServerInfo = {};

          return {
            Gateway: gateway,
            error: ERRORCODE.NET_E_SERVER_INACTIVATE,
          };
        }

        // 업데이트가 필요함.
        if (gateway.stateType === SERVER_STATE.NEED_UPDATE) {
          // 업데이트가 필요함.
          const osTypes = await this.osTypeRepository.findOne({
            where: {
              type: data.osType,
            },
          });

          const serverState = await this.serverStateRepository.findOne({
            select: ['state'],
            where: {
              state: SERVER_STATE.NEED_UPDATE,
            },
          });

          const stateMessage = await this.stateMessageRepository.findOne({
            select: ['message'],
            where: {
              id: 2,
            },
          });
          return {
            OsType: osTypes,
            ServerState: serverState,
            StateMessage: stateMessage,
            error: ERRORCODE.NET_E_NEED_UPDATE,
          };
        }

        // 테스트 모드임.
        if (gateway.stateType === SERVER_STATE.TEST) {
          const testMember = await this.testMemberRepository.findOne({
            where: {
              deviceId: data.deviceId,
            },
          });

          if (!testMember) {
            return {
              Gateway: gateway,
              error: ERRORCODE.NET_E_SERVER_INACTIVATE,
            };
          }
        }

        const serverInfo = await this.serverInfoRepository.findOne({
          where: {
            serverType: gateway.ServerType.type,
          },
        });

        gateway.ServerType.ServerInfo = serverInfo;

        return { Gateway: gateway };
      }
    } catch (err) {
      this.logger.error({ err });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
