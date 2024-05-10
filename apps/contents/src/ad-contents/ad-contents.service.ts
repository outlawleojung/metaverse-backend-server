import {
  AdContents,
  AdContentsRepository,
  Member,
  MemberAdContents,
  MemberAdContentsRepository,
  MemberMoneyRepository,
} from '@libs/entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { AdContentsRewardDto } from './dto/req/ad.contents.reward.dto';
import { ERRORCODE, ERROR_MESSAGE } from '@libs/constants';

@Injectable()
export class AdContentsService {
  private readonly logger = new Logger(AdContentsService.name);
  constructor(
    private adContentsRepository: AdContentsRepository,
    private memberAdContentsRepository: MemberAdContentsRepository,
    private memberMoneyRepository: MemberMoneyRepository,
  ) {}

  async adContentsReward(
    memberId: string,
    data: AdContentsRewardDto,
    queryRunner: QueryRunner,
  ) {
    const memberAdContents =
      await this.memberAdContentsRepository.findByMemberIdAndContentsId(
        memberId,
        data.contentsId,
      );

    if (memberAdContents) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const adContents = await this.adContentsRepository.findById(
      data.contentsId,
    );

    // 보상 획득
    await this.memberMoneyRepository.addMemberMoney(
      memberId,
      adContents.moneyType,
      adContents.reward,
      queryRunner,
    );

    // 보상 획득 완료 처리
    const newMemberAdContents = new MemberAdContents();
    newMemberAdContents.memberId = memberId;
    newMemberAdContents.contentsId = data.contentsId;

    await this.memberAdContentsRepository.create(
      newMemberAdContents,
      queryRunner,
    );

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      contentsId: data.contentsId,
      moneyType: adContents.moneyType,
      count: adContents.reward,
    };
  }
}
