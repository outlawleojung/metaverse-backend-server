import {
  ERRORCODE,
  ERROR_MESSAGE,
  VOTE_RESULT_EXPOSURE_TYPE,
  VOTE_RESULT_TYPE,
} from '@libs/constants';
import {
  KtmfEventEmailInfo,
  MemberSelectVoteInfo,
  MemberSelectVoteLike,
  SelectVoteInfo,
  SelectVoteItem,
} from '@libs/entity';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetCommonDto } from '../dto/get.common.dto';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import { DoVoteDto } from './dto/req/do.vote.dto';
import { HttpStatusCode } from 'axios';

@Injectable()
export class SelectVoteService {
  constructor(
    @InjectRepository(SelectVoteInfo)
    private selectVoteInfoRepository: Repository<SelectVoteInfo>,
    @InjectRepository(MemberSelectVoteInfo)
    private memberSelectVoteInfoRepository: Repository<MemberSelectVoteInfo>,
    @InjectRepository(SelectVoteItem)
    private selectVoteItemRepository: Repository<SelectVoteItem>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  private readonly logger = new Logger(SelectVoteService.name);

  // 투표 목록 보여주기
  async getSelectVote(data: GetCommonDto) {
    const selectVoteInfo = await this.selectVoteInfoRepository
      .createQueryBuilder('s')
      .select([
        's.id as id',
        's.name as name',
        's.resultType as resultType',
        's.voteCount as voteCount',
        's.startedAt as startedAt',
        's.endedAt as endedAt',
      ])
      .addSelect('TIMESTAMPDIFF(SECOND, NOW(), s.endedAt)', 'remainEnd')
      .addSelect(
        'TIMESTAMPDIFF(SECOND, NOW(), s.resultStartedAt)',
        'remainResultStart',
      )
      .addSelect(
        'TIMESTAMPDIFF(SECOND, NOW(), s.resultEndedAt)',
        'remainResultEnd',
      )
      .where('s.startedAt <= NOW()')
      .andWhere('s.resultEndedAt >= NOW()')
      .getRawOne();

    if (!selectVoteInfo) {
      // 진행중인 투표가 없으면 error 리턴
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_PROGRESS_VOTE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_PROGRESS_VOTE),
        },
        HttpStatusCode.Forbidden,
      );
    }
    // 나의 투표 정보
    const myVote = await this.memberSelectVoteInfoRepository.find({
      select: ['itemNum'],
      where: {
        voteId: selectVoteInfo.id,
        memberId: data.memberId,
      },
    });

    // 투표 항목 ( 배열 )
    const voteItems = await this.selectVoteItemRepository
      .createQueryBuilder('v')
      .select([
        'v.itemNum as itemNum',
        'v.displayNum as displayNum',
        'v.name as name',
        'v.description as description',
        'v.videoUrl as videoUrl',
        'v.imageName as imageName',
      ])
      .addSelect('IFNULL(like.isLike, 0)', 'isLike')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(like.itemNum)', 'likeCount')
          .from('MemberSelectVoteLike', 'like')
          .where('like.isLike = :isLike', { isLike: 1 })
          .andWhere('like.voteId = v.voteId and like.itemNum = v.itemNum');
      }, 'likeCount')
      .leftJoin(
        'v.MemberSelectVoteLikes',
        'like',
        'like.memberId = :memberId AND like.voteId = v.voteId',
        {
          memberId: data.memberId,
        },
      )
      .where('v.voteId = :voteId', { voteId: selectVoteInfo.id })
      .groupBy('v.itemNum')
      .getRawMany();

    voteItems.forEach((voteItem) => {
      voteItem.likeCount = parseInt(voteItem.likeCount, 10);
    });

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      selectVoteInfo,
      voteItems,
      myVote,
    };
  }

  // 투표 하기
  async doVote(data: DoVoteDto) {
    const voteInfo = await this.selectVoteInfoRepository.findOne({
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
      console.log('투표 가능 시간이 아님');
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_VOTE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_VOTE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 투표 권한 확인
    const myVoteCount = await this.memberSelectVoteInfoRepository.count({
      where: {
        voteId: voteInfo.id,
        memberId: data.memberId,
      },
    });

    console.log('총 투표권 : ', voteInfo.voteCount);
    console.log('내가 투표한 개수 : ', myVoteCount);
    if (voteInfo.voteCount <= myVoteCount) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_VOTE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_VOTE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 중복 투표인지 확인
    const myExVote = await this.memberSelectVoteInfoRepository.findOne({
      where: {
        voteId: data.voteId,
        itemNum: data.itemNum,
        memberId: data.memberId,
      },
    });

    console.log('중복 투표 : ', myExVote);
    if (myExVote) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_VOTE,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_VOTE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const memberSelectVote = new MemberSelectVoteInfo();
    memberSelectVote.memberId = data.memberId;
    memberSelectVote.voteId = data.voteId;
    memberSelectVote.itemNum = data.itemNum;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(MemberSelectVoteInfo)
        .save(memberSelectVote);
      await queryRunner.commitTransaction();

      // 나의 투표 정보
      const myVote = await this.memberSelectVoteInfoRepository.find({
        select: ['itemNum'],
        where: {
          voteId: data.voteId,
          memberId: data.memberId,
        },
      });

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        myVote,
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

  // 좋아요
  async doLike(data: DoVoteDto) {
    const voteInfo = await this.selectVoteInfoRepository.findOne({
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

    // 좋아요 가능한지 확인
    if (voteInfo.startedAt > new Date() || voteInfo.endedAt < new Date()) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_VOTE,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_VOTE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const memberLike = await this.dataSource
        .getRepository(MemberSelectVoteLike)
        .findOne({
          where: {
            memberId: data.memberId,
            voteId: data.voteId,
            itemNum: data.itemNum,
          },
        });

      const like = new MemberSelectVoteLike();
      like.memberId = data.memberId;
      like.voteId = data.voteId;
      like.itemNum = data.itemNum;

      if (memberLike) {
        like.isLike = memberLike.isLike === 0 ? 1 : 0;
      } else {
        like.isLike = 1;
      }

      await queryRunner.manager.getRepository(MemberSelectVoteLike).save(like);
      await queryRunner.commitTransaction();

      const count = await this.dataSource
        .getRepository(MemberSelectVoteLike)
        .createQueryBuilder('like')
        .select('COUNT(like.itemNum)', 'likeCount')
        .where('like.isLike = :isLike', { isLike: 1 })
        .andWhere('like.voteId = :voteId', { voteId: data.voteId })
        .andWhere('like.itemNum = :itemNum', { itemNum: data.itemNum })
        .getRawOne();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        likeInfo: {
          itemNum: data.itemNum,
          isLike: like.isLike,
          likeCount: parseInt(count.likeCount),
        },
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

  // 투표 결과 조회
  async getVoteResult(memberId: string, voteId: number) {
    // 결과 조회가 가능한지 여부
    const voteInfo = await this.selectVoteInfoRepository.findOne({
      where: {
        id: voteId,
        resultStartedAt: LessThan(new Date()),
        resultEndedAt: MoreThan(new Date()),
      },
    });

    console.log(voteInfo);

    if (!voteInfo) {
      // 투표 결과 노출 기간이 아님
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_VOTE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_VOTE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 결과 미노출
    if (voteInfo.resultType === VOTE_RESULT_TYPE.NONE) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_VOTE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_VOTE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 투표 사용자에게만 노출
    if (voteInfo.resultType === VOTE_RESULT_TYPE.VOTE_USER) {
      const memberVoteCount = await this.memberSelectVoteInfoRepository.count({
        where: {
          voteId: voteId,
          memberId: memberId,
        },
      });

      if (memberVoteCount === 0) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_NOT_EXIST_VOTE,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_VOTE),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // 전체 투표자 수
    const voteTotalCount = await this.memberSelectVoteInfoRepository.count({
      where: {
        voteId: voteId,
      },
    });

    const rankingQuery = await this.selectVoteItemRepository
      .createQueryBuilder('item')
      .select('item.voteId as voteId')
      .addSelect([
        'item.itemNum as itemNum',
        'item.displayNum as displayNum',
        'item.name as name',
        'item.imageName as imageName',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(m.itemNum)', 'voteCount')
          .from('MemberSelectVoteInfo', 'm')

          .where('m.voteId = item.voteId and m.itemNum = item.itemNum');
      }, 'voteCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(like.itemNum)', 'likeCount')
          .from('MemberSelectVoteLike', 'like')
          .where('like.isLike = :isLike', { isLike: 1 })
          .andWhere(
            'like.voteId = item.voteId and like.itemNum = item.itemNum',
          );
      }, 'likeCount')
      .where('item.voteId = :voteId', { voteId })
      .groupBy('item.voteId, item.itemNum')
      .orderBy({ voteCount: 'DESC', 'item.itemNum': 'DESC' })
      .getRawMany();

    let previousVoteCount = null; // 이전 voteCount 값을 추적할 변수를 추가합니다.
    let previousRank = 0; // 이전 순위 값을 추적할 변수를 추가합니다.
    let position = 0;

    const rankingResults = rankingQuery.map((result, index) => {
      const sameAsPrevious = result.voteCount === previousVoteCount; // 이전 항목과 현재 항목의 voteCount 비교

      position += 1;
      if (!sameAsPrevious) {
        previousRank = position;
      }

      // 현재 결과의 voteCount 값을 이전 voteCount 변수에 저장
      previousVoteCount = result.voteCount;

      const rate = ((result.voteCount / voteTotalCount) * 100).toFixed(2);
      const count = result.voteCount;

      return {
        rank: previousRank,
        voteId: result.voteId,
        itemNum: result.itemNum,
        name: result.name,
        imageName: result.imageName,
        voteCount: Number(count),
        likeCount: Number(result.likeCount),
        rate: Number(rate),
      };
    });

    // console.log(rankingResults);

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      rank: rankingResults,
      voteTotalCount: voteTotalCount,
      resultExposureType: voteInfo.resultExposureType,
    };
  }

  async getKtmfEmail(memberId: string) {
    const email = await this.dataSource
      .getRepository(KtmfEventEmailInfo)
      .findOne({
        where: {
          memberId: memberId,
        },
      });

    if (email) {
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } else {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_EMAIL,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_EMAIL),
        },
        HttpStatusCode.Forbidden,
      );
    }
  }
}
