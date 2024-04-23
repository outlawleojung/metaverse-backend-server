import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import {
  Member,
  MemberBusinessCardInfo,
  MemberDefaultCardInfo,
} from '@libs/entity';
import { DataSource, Repository } from 'typeorm';
import { CommonService } from '@libs/common';
import { ERRORCODE, ERROR_MESSAGE, BUSINISS_CARD_TYPE } from '@libs/constants';
import {
  GetOthersResponsesDto,
  OhtersMemberData,
} from './dto/get.others.response.dto';

@Injectable()
export class OthersService {
  private readonly logger = new Logger(OthersService.name);
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private readonly commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  async getOthersMemberInfo(type: number, othersId: string) {
    try {
      let where = {};
      if (type === 1) {
        where = {
          memberId: othersId,
        };
      } else if (type === 2) {
        where = {
          memberCode: othersId,
        };
      } else {
        return {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        };
      }

      //  타인 존재 여부 확인
      const exMember = await this.memberRepository.findOne({
        select: [
          'id',
          'memberCode',
          'nickname',
          'stateMessage',
          'myRoomStateType',
        ],
        where,
      });

      if (!exMember) {
        return {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        };
      }

      const defaultBizCard = await this.dataSource
        .getRepository(MemberDefaultCardInfo)
        .findOne({
          where: {
            memberId: exMember.id,
          },
        });

      // 대표 설정 명함이 있다면
      let bizCard: MemberBusinessCardInfo = null;
      if (defaultBizCard) {
        bizCard = await this.dataSource
          .getRepository(MemberBusinessCardInfo)
          .findOne({
            select: [
              'templateId',
              'name',
              'phone',
              'email',
              'addr',
              'fax',
              'job',
              'position',
              'intro',
            ],
            where: {
              memberId: exMember.id,
              templateId: defaultBizCard.templateId,
              num: defaultBizCard.num,
            },
          });
      }
      //대표 설정 명함이 없다면
      else {
        bizCard = await this.dataSource
          .getRepository(MemberBusinessCardInfo)
          .findOne({
            select: [
              'templateId',
              'name',
              'phone',
              'email',
              'addr',
              'fax',
              'job',
              'position',
              'intro',
            ],
            where: {
              memberId: exMember.id,
            },
            order: {
              num: 'DESC',
            },
          });
      }

      const othersMember: any = {};
      othersMember.memberCode = exMember.memberCode;
      othersMember.myRoomStateType = exMember.myRoomStateType;
      othersMember.nickname = exMember.nickname || null;
      othersMember.stateMessage = exMember.stateMessage || null;
      othersMember.bizCard = bizCard;

      const avatarInfos = await this.commonService.getMemberAvatarInfo(
        exMember.memberCode,
      );
      othersMember.avatarInfos = avatarInfos;

      return {
        othersMember,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      this.logger.error(err);
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
