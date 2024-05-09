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
import { ERRORCODE, ERROR_MESSAGE, OTHER_FIND_TYPE } from '@libs/constants';

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
      // let where: any = {};
      // switch (type) {
      //   case OTHER_FIND_TYPE.MEMBER_ID:
      //     where = {
      //       id: othersId,
      //     };
      //     break;
      //   case OTHER_FIND_TYPE.MEMBER_CODE:
      //     where = {
      //       memberCode: othersId,
      //     };
      //     break;
      //   default:
      //     throw new Error('Type 이 잘목 됐습니다.');
      // }

      // //  타인 존재 여부 확인
      // const exMember = await this.memberRepository.findOne({
      //   select: [
      //     'id',
      //     'memberCode',
      //     'nickname',
      //     'stateMessage',
      //     'myRoomStateType',
      //   ],
      //   where,
      // });

      const rawResults = await this.memberRepository
        .createQueryBuilder('m')
        .select([
          'm.id as memberId',
          'm.memberCode as memberCode',
          'm.nickname as nickname',
          'm.stateMessage as stateMessage',
          'm.myRoomStateType as myRoomStateType',
          'ai.avatarPartsType as avatarPartsType',
          'ai.itemId as itemId',
        ])
        .leftJoin('m.MemberAvatarInfos', 'ai');

      switch (type) {
        case OTHER_FIND_TYPE.MEMBER_ID:
          await rawResults.where('m.id = :othersId', { othersId });
          break;
        case OTHER_FIND_TYPE.MEMBER_CODE:
          await rawResults.where('m.memberCode = :othersId', { othersId });
          break;
        default:
          throw new Error('Type 이 잘목 됐습니다.');
      }

      const exMember = await rawResults.getRawMany();

      if (!exMember) {
        return {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        };
      }

      const memberId = exMember[0].memberId;

      const defaultBizCard = await this.dataSource
        .getRepository(MemberDefaultCardInfo)
        .findOne({
          where: {
            memberId,
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
              memberId,
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
              memberId,
            },
            order: {
              num: 'DESC',
            },
          });
      }

      const othersMember = {
        memberCode: exMember[0].memberCode,
        myRoomStateType: exMember[0].myRoomStateType,
        nickname: exMember[0].nickname || null,
        stateMessage: exMember[0].stateMessage || null,
        bizCard: bizCard,

        avatarInfos: exMember.map((item) => ({
          [item.avatarPartsType]: item.itemId,
        })),
      };

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
