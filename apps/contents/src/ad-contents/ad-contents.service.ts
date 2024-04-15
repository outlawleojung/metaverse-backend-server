import { AdContents, Member, MemberAdContents } from '@libs/entity';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AdContentsRewardDto } from './dto/req/ad.contents.reward.dto';
import { ERRORCODE, ERROR_MESSAGE } from '@libs/constants';
import { CommonService } from '@libs/common';

@Injectable()
export class AdContentsService {
  private readonly logger = new Logger(AdContentsService.name);
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(AdContents)
    private adContentsRepository: Repository<AdContents>,
    @InjectRepository(MemberAdContents)
    private memberAdContentsRepository: Repository<MemberAdContents>,
    private commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  async adContentsReward(memberId: string, data: AdContentsRewardDto) {
    const memberAdContents = await this.memberAdContentsRepository.findOne({
      where: {
        memberId,
        contentsId: data.contentsId,
      },
    });

    if (memberAdContents) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const adContents = await this.adContentsRepository.findOne({
      where: {
        id: data.contentsId,
      },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 보상 획득
      await this.commonService.addMemberMoney(
        queryRunner,
        memberId,
        adContents.moneyType,
        adContents.reward,
      );

      // 보상 획득 완료 처리
      const newMemberAdContents = new MemberAdContents();
      newMemberAdContents.memberId = memberId;
      newMemberAdContents.contentsId = data.contentsId;

      await queryRunner.manager
        .getRepository(MemberAdContents)
        .save(newMemberAdContents);

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        contentsId: data.contentsId,
        moneyType: adContents.moneyType,
        count: adContents.reward,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ err });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
