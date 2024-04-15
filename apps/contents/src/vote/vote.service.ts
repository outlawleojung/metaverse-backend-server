import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberVoteInfo, VoteInfo, VoteInfoExample } from '@libs/entity';

import {
  ERRORCODE,
  ERROR_MESSAGE,
  VOTE_RES_TYPE,
  VOTE_STATE_TYPE,
} from '@libs/constants';
import { DoVoteDto } from './dto/request/do.vote.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteInfo)
    private voteInfoRepository: Repository<VoteInfo>,
    @InjectRepository(MemberVoteInfo)
    private memberVoteInfoRepository: Repository<MemberVoteInfo>,
    @InjectRepository(VoteInfoExample)
    private voteInfoExampleRepository: Repository<VoteInfoExample>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  private readonly logger = new Logger(VoteService.name);

  async getVotes(memberId: string) {
    const voteInfo = await this.voteInfoRepository
      .createQueryBuilder('voteInfo')
      .select([
        'voteInfo.id as id',
        'voteInfo.name as name',
        'voteInfo.question as question',
        'voteInfo.imageName as imageName',
        'voteInfo.divType as divType',
        'voteInfo.resType as resType',
        'voteInfo.alterResType as alterResType',
        'voteInfo.resultExposureType as resultExposureType',
        'voteInfo.isExposingResult as isExposingResult',
        'voteInfo.isEnabledEdit as isEnabledEdit',
        'voteInfo.startedAt as startedAt',
        'voteInfo.endedAt as endedAt',
        'voteInfo.resultEndedAt as resultEndedAt',
      ])
      .addSelect(
        `CASE
          WHEN endedAt < now() and resultEndedAt > now() then 3
            WHEN resultEndedAt < now() then 4
            WHEN startedAt < now() and endedAt > now() then 2
            when startedAt > now() then 1
        END`,
        'stateType',
      )
      .where('startedAt <= NOW()')
      .andWhere('resultEndedAt >= NOW()')
      .getRawOne();

    let isEnabledVoteInfo = 1;
    let isVote = 0;
    let endedRemainDt = 0;
    let resultRemainDt = 0;

    if (voteInfo) {
      // 투표 선택 보기
      const voteInfoExamples = await this.voteInfoExampleRepository.find({
        select: ['num', 'contents'],
        where: {
          voteId: voteInfo.id,
        },
      });

      const temp: any = await this.voteInfoRepository.findOne({
        select: ['endedAt', 'resultEndedAt'],
        where: {
          id: voteInfo.id,
        },
      });

      const now = new Date(); //현재시간을 구한다.
      const nt = now.getTime(); // 현재 초

      // 투표 진행 중
      if (voteInfo.stateType === VOTE_STATE_TYPE.PROGRESS) {
        // 투표 기록 조회
        const memberVoteInfo = await this.memberVoteInfoRepository.findOne({
          where: {
            memberId,
            voteId: voteInfo.id,
          },
        });

        if (memberVoteInfo) {
          if (voteInfo.isEnabledEdit === 0) {
            isEnabledVoteInfo = 0; // 재투표 가능 여부
          }
          isVote = 1; // 투표 참여 여부

          const endedSec = new Date(temp.endedAt).getTime();
          endedRemainDt = Math.floor((endedSec - nt) / 1000);
        } else if (voteInfo.stateType === VOTE_STATE_TYPE.COMPLETED) {
          const resultSec = new Date(temp.resultEndedAt).getTime();
          resultRemainDt = Math.floor((resultSec - nt) / 1000);
        }
      }

      const r = await this.memberVoteInfoRepository
        .createQueryBuilder('m')
        .select('num')
        .addSelect('COUNT(*) as count')
        .groupBy('m.num')
        .where('m.voteId = :voteId', { voteId: voteInfo.id })
        .getRawMany();

      const resultInfo: any = [];
      for (let index = 0; index < r.length; index++) {
        const e = r[index];
        const result = {
          num: Number(e.num),
          count: Number(e.count),
        };

        resultInfo.push(result);
      }

      this.logger.debug({ voteInfo: voteInfo });
      return {
        voteInfo,
        voteInfoExamples,
        isEnabledVoteInfo,
        isVote,
        endedRemainDt,
        resultRemainDt,
        resultInfo,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    }

    return {
      error: ERRORCODE.NET_E_NOT_EXIST_PROGRESS_VOTE,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_PROGRESS_VOTE),
    };
  }

  // 투표 하기
  async DoVote(memberId: string, data: DoVoteDto) {
    const voteInfo = await this.voteInfoRepository.findOne({
      where: {
        id: data.voteId,
      },
    });

    // 투표 존재 여부 확인
    if (!voteInfo) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_VOTE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_VOTE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const now = new Date();

    // 투표가 가능한지 확인
    if (voteInfo.startedAt > now || voteInfo.endedAt < now) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_VOTE,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_VOTE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 투표 응답 보기 갯수
    const examCount = await this.voteInfoExampleRepository.count({
      where: {
        voteId: data.voteId,
      },
    });

    // 투표 응답 방식
    const voteResType = voteInfo.resType;

    if (
      (voteResType === VOTE_RES_TYPE.SINGLE && data.response.length > 1) ||
      (voteResType === VOTE_RES_TYPE.MULTIPLE &&
        data.response.length > examCount - 1)
    ) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_TOO_MANY_RESPONSE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_TOO_MANY_RESPONSE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 투표 구분
    const voteDivType = voteInfo.divType;

    // 양일 투표 응답 방식
    const voteAlterResType = voteInfo.alterResType;

    // 투표 수정 여부 확인
    const voteEnabledEdit = voteInfo.isEnabledEdit;

    const memberVoteInfo = await this.memberVoteInfoRepository.find({
      where: {
        voteId: data.voteId,
        memberId,
      },
    });

    // 투표 수정이 불가 하고 기존에 투표를 했다면
    if (voteEnabledEdit === 0 && memberVoteInfo.length > 0) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_VOTE,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_VOTE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 기존 응답이 있다면 삭제
      await queryRunner.manager.delete(MemberVoteInfo, {
        memberId,
        voteId: data.voteId,
      });

      // 응답 기록 하기
      for (let index = 0; index < data.response.length; index++) {
        const responseNum = data.response[index];

        // 응답이 맞는지 검증
        const voteInfoExam = await this.voteInfoExampleRepository.findOne({
          where: {
            voteId: data.voteId,
            num: responseNum,
          },
        });

        if (!voteInfoExam) {
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_WRONG_RESPONSE,
              message: ERROR_MESSAGE(ERRORCODE.NET_E_WRONG_RESPONSE),
            },
            HttpStatus.FORBIDDEN,
          );
        }

        // 응답 추가
        const memberVoteInfo = new MemberVoteInfo();
        memberVoteInfo.voteId = data.voteId;
        memberVoteInfo.memberId = memberId;
        memberVoteInfo.num = responseNum;

        await queryRunner.manager
          .getRepository(MemberVoteInfo)
          .save(memberVoteInfo);
      }

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
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
