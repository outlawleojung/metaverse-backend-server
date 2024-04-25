import { ERRORCODE, ERROR_MESSAGE } from '@libs/constants';
import { InfiniteCodeRank, Member, MemberInfiniteCodeRank } from '@libs/entity';
import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateRankingDto } from './dto/create.ranking.dto';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(InfiniteCodeRank)
    private infiniteCodeRankRepository: Repository<InfiniteCodeRank>,
    @InjectRepository(MemberInfiniteCodeRank)
    private memberInfiniteCodeRankRepository: Repository<MemberInfiniteCodeRank>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  async crreateRanking(memberId: string, data: CreateRankingDto) {
    // 사용자 랭킹 추가
    const memberRanking = new MemberInfiniteCodeRank();
    memberRanking.memberId = memberId;
    memberRanking.userScore = data.score;

    // 전체 랭킹에서 내 랭킹 검색
    const myGlobalRank = await this.infiniteCodeRankRepository.findOne({
      where: {
        memberId: memberId,
      },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(MemberInfiniteCodeRank)
        .save(memberRanking);

      const newRanking = new InfiniteCodeRank();
      newRanking.memberId = memberId;
      newRanking.userScore = data.score;

      let isNew = false;
      // 전체 랭킹에 없으면 추가
      if (!myGlobalRank) {
        isNew = true;
      } else {
        // 이전 전체 랭킹의 기록과 신규 랭킹 기록 비교
        if (myGlobalRank.userScore > data.score) {
          // 기록이 단축 됐다면 업데이트
          isNew = true;
        }
      }

      if (isNew) {
        await queryRunner.manager
          .getRepository(InfiniteCodeRank)
          .save(newRanking);
      }

      await queryRunner.commitTransaction();

      const myRanking = await this.myRanking(memberId);
      const allRanking = await this.allRanking();
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        myRanking,
        allRanking,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.OK,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getAllMyRanking(memberId: string) {
    const myRanking = await this.myRanking(memberId);
    const allRanking = await this.allRanking();
    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      myRanking,
      allRanking,
    };
  }

  async getMyRanking(memberId: string) {
    const myRanking = await this.myRanking(memberId);
    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      myRanking,
    };
  }

  async getAllRanking() {
    const allRanking = await this.allRanking();

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      allRanking,
    };
  }

  private async allRanking() {
    return await this.infiniteCodeRankRepository
      .createQueryBuilder('r')
      .select(`(RANK() OVER (ORDER BY userScore ASC))`, 'rank')
      .addSelect([
        'r.userScore as userScore',
        'member.id as memberId',
        'member.nickname as nickname',
      ])
      .leftJoin('r.Member', 'member')
      .getRawMany();
  }

  private async myRanking(memberId: string) {
    return await this.memberInfiniteCodeRankRepository
      .createQueryBuilder('r')
      .select(`(RANK() OVER (ORDER BY userScore ASC))`, 'rank')
      .addSelect([
        'r.userScore as userScore',
        'member.id as memberId',
        'member.nickname as nickname',
      ])
      .leftJoin('r.Member', 'member')
      .where('r.memberId=:memberId', { memberId })
      .getRawMany();
  }
}
