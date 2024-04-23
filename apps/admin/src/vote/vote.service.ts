import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ForbiddenException, HttpException } from '@nestjs/common/exceptions';
import {
  ADMIN_PAGE,
  ROLE_TYPE,
  SEARCH_TYPE,
  stringState,
  VOTE_DIV_TYPE,
  VOTE_STATE_TYPE,
} from '@libs/constants';
import { AzureBlobService } from '@libs/common';
import path from 'path';
import { DataSource, Repository } from 'typeorm';
import {
  VoteInfo,
  VoteDivType,
  VoteResType,
  VoteAlterResType,
  VoteResultExposureType,
  VoteStateType,
  MemberVoteInfo,
  VoteInfoExample,
  VoteAlterResponse,
  VoteResultType,
  Admin,
} from '@libs/entity';
import { AddVoteRegisterDto } from './dto/req/add.vote.dto';
import dayjs from 'dayjs';
import { UpdateVoteInfoDto } from './dto/req/update.vote.info.dto';
import { UnixTimestamp } from '@libs/common';
import { GetVoteResultListInfoDto } from './dto/req/get.vote.result.list.info.dto';
import { GetTableDto } from '../common/dto/get.table.dto';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private azureBlobService: AzureBlobService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(VoteService.name);
  // 투표 리스트 조회
  async getVoteList(adminId: number, data: GetTableDto) {
    const page = data?.page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    const searchType = data.searchType ? data.searchType : '';
    const searchValue = data.searchValue ? data.searchValue : '';

    try {
      const voteList = await this.dataSource
        .getRepository(VoteInfo)
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
          'voteInfo.divType as divType',
          'voteDivType.name as divTypeName',
          'voteInfo.alterResType as alterResType',
          'voteAlterResType.name as alterResTypeName',
          'voteInfo.resultExposureType as resultExposureType',
          'voteResultExposureType.name as resultExposureTypeName',
        ])
        .addSelect(
          `CASE
          WHEN endedAt < now() and resultEndedAt > now() then '집계완료'
              WHEN endedAt < now() then '종료'
              WHEN startedAt < now() then '진행중'
              when startedAt > now() then '예정'
          END`,
          'stateName',
        )
        .addSelect(
          `CASE
          WHEN endedAt < now() and resultEndedAt > now() then 3
            WHEN resultEndedAt < now() then 4
            WHEN startedAt < now() and endedAt > now() then 2
            when startedAt > now() then 1
        END`,
          'stateType',
        )
        .innerJoin('voteInfo.VoteDivType', 'voteDivType')
        .innerJoin('voteInfo.VoteAlterResType', 'voteAlterResType')
        .innerJoin('voteInfo.VoteResultExposureType', 'voteResultExposureType')
        .offset(offset)
        .limit(limit)
        .orderBy('voteInfo.startedAt', 'DESC');

      const voteCount = await this.dataSource
        .getRepository(VoteInfo)
        .createQueryBuilder('voteInfo');

      switch (searchType) {
        case SEARCH_TYPE.DIV_TYPE:
          voteList.andWhere('voteInfo.divType = :divType', {
            divType: searchValue,
          });
          voteCount.andWhere('voteInfo.divType = :divType', {
            divType: searchValue,
          });
          break;
        case SEARCH_TYPE.STATE_TYPE:
          if (Number(searchValue) === VOTE_STATE_TYPE.SCHEDULED) {
            voteList.andWhere('voteInfo.startedAt > NOW()');
            voteCount.andWhere('voteInfo.startedAt > NOW()');
          } else if (Number(searchValue) === VOTE_STATE_TYPE.COMPLETED) {
            voteList.andWhere('voteInfo.endedAt < NOW()');
            voteList.andWhere('voteInfo.resultEndedAt > NOW()');

            voteCount.andWhere('voteInfo.endedAt < NOW()');
            voteCount.andWhere('voteInfo.resultEndedAt > NOW()');
          } else if (Number(searchValue) === VOTE_STATE_TYPE.END) {
            voteList.andWhere('voteInfo.resultEndedAt < NOW()');
            voteCount.andWhere('voteInfo.resultEndedAt < NOW()');
          } else if (Number(searchValue) === VOTE_STATE_TYPE.PROGRESS) {
            voteList.andWhere('voteInfo.startedAt < NOW()');
            voteList.andWhere('voteInfo.endedAt > NOW()');

            voteCount.andWhere('voteInfo.startedAt < NOW()');
            voteCount.andWhere('voteInfo.endedAt > NOW()');
          }
          break;
        case SEARCH_TYPE.NAME:
          voteList.andWhere('voteInfo.name like :name', {
            name: `%${searchValue}%`,
          });
          voteCount.andWhere('voteInfo.name like :name', {
            name: `%${searchValue}%`,
          });
          break;
        default:
          break;
      }

      const rows = await voteList.getRawMany();
      const count = await voteCount.getCount();

      return { rows, count };
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException('투표 목록 조회 실패', 500);
    }
  }

  // 투표 추가
  async postVoteRegister(
    adminId: number,
    file: Express.Multer.File,
    data: AddVoteRegisterDto,
  ) {
    const divType = data.divType;
    const alterResType = data.alterResType;
    const name = data.name;
    const question = data.question;
    const resType = data.resType;
    const resultExposureType = data.resultExposureType;
    const isExposingResult = data.isExposingResult;
    const isEnabledEdit = data.isEnabledEdit;
    const startedAt = new Date(data.startedAt);
    const endedAt = new Date(data.endedAt);
    const resultEndedAt = new Date(data.resultEndedAt);

    // 설정 시간 체크 하기
    const voteInfoList = await this.dataSource
      .getRepository(VoteInfo)
      .createQueryBuilder('voteInfo')
      .where('voteInfo.resultEndedAt >= NOW()')
      .andWhere('voteInfo.deletedAt IS NULL')
      .getMany();

    const _startedAt = new Date(data.startedAt);
    const _resultEndedAt = new Date(data.resultEndedAt);

    for (let index = 0; index < voteInfoList.length; index++) {
      const voteInfo = voteInfoList[index];

      if (
        _startedAt >= new Date(voteInfo.startedAt) &&
        _startedAt <= new Date(voteInfo.resultEndedAt)
      ) {
        this.logger.error('해당 날짜에는 투표를 생성 할 수 없습니다.');
        throw new ForbiddenException(
          '해당 날짜에는 투표를 생성 할 수 없습니다.',
        );
      }

      if (
        _resultEndedAt >= new Date(voteInfo.startedAt) &&
        _resultEndedAt <= new Date(voteInfo.resultEndedAt)
      ) {
        this.logger.error('해당 날짜에는 투표를 생성 할 수 없습니다.');
        throw new ForbiddenException(
          '해당 날짜에는 투표를 생성 할 수 없습니다.',
        );
      }
    }

    // 투표 구분 방식 체크
    // 1. 양일 투표
    if (divType === VOTE_DIV_TYPE.ALTERNATIVE) {
      // 양일 투표 일 경우 : 양일 투표 응답 방식 선택 1. O/X  || 2. 찬성/반대
      if (!stringState(alterResType)) {
        throw new ForbiddenException('양일 투표 응답 방식 입력해 주세요.');
      }
    }
    // 2. 선택 투표
    else if (divType === VOTE_DIV_TYPE.CHOICE) {
      // 선택 투표 일 경우 : 선택 보기 등록
      // 선택 투표 일 경우 : 투표 응답 방식 체크 1. 단일 선택 / 2. 복수 선택
      if (!stringState(resType))
        throw new ForbiddenException('투표 응답 방식 입력해 주세요.');
    } else {
      throw new ForbiddenException('투표 구분을 입력해 주세요.');
    }

    const voteInfo = new VoteInfo();
    voteInfo.name = name;
    voteInfo.question = question;
    voteInfo.divType = divType;
    voteInfo.alterResType = alterResType;
    voteInfo.resType = resType;
    voteInfo.resultExposureType = resultExposureType;
    voteInfo.isExposingResult = isExposingResult;
    voteInfo.isEnabledEdit = isEnabledEdit;
    voteInfo.startedAt = new Date(startedAt);
    voteInfo.endedAt = new Date(endedAt);
    voteInfo.resultEndedAt = new Date(resultEndedAt);
    voteInfo.adminId = adminId;

    if (file) {
      voteInfo.imageName = file.originalname;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newVoteInfo = await this.dataSource.manager
        .getRepository(VoteInfo)
        .save(voteInfo);

      if (divType === VOTE_DIV_TYPE.ALTERNATIVE) {
        const voteAlterResponse = await this.dataSource
          .getRepository(VoteAlterResponse)
          .find({
            where: {
              alterResType: alterResType,
            },
          });

        for (const res of voteAlterResponse) {
          const voteExample = new VoteInfoExample();
          voteExample.voteId = voteInfo.id;
          voteExample.num = res.id;
          voteExample.contents = res.name;

          await queryRunner.manager
            .getRepository(VoteInfoExample)
            .save(voteExample);
        }
      }

      if (file) {
        const path = `vote/${newVoteInfo.id}/${file.originalname}`;

        await this.azureBlobService.upload(file, path);
      }

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error({ error });
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  // 투표 날짜 정보 조회
  async getVoteDateInfo() {
    try {
      const voteInfo = await this.dataSource
        .getRepository(VoteInfo)
        .createQueryBuilder('voteInfo')
        .select('resultEndedAt')
        .orderBy({ 'voteInfo.resultEndedAt': 'DESC' })
        .getOne();

      return {
        settabledAt: voteInfo
          ? dayjs(voteInfo.resultEndedAt).format('YYYY-MM-DD HH:mm:ss')
          : null,
      };
    } catch (e) {
      this.logger.error({ e });
      throw new HttpException('투표 날짜 정보 조회 실패', 500);
    }
  }

  // 투표 삭제
  async deleteVoteInfo(userId: number, voteId: number, page: number) {
    const voteInfo = await this.dataSource.getRepository(VoteInfo).findOne({
      where: {
        id: voteId!,
      },
    });

    if (!voteInfo) {
      throw new ForbiddenException('존재하지 않는 투표 입니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource.getRepository(VoteInfo).softDelete({ id: voteId });
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return true;
    } catch (error) {
      this.logger.error({ error });
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return false;
    }
  }

  // 투표 정보 수정
  async patchVoteInfo(
    file: Express.Multer.File,
    adminId: number,
    voteId: number,
    data: UpdateVoteInfoDto,
  ) {
    const name = data.name;
    const question = data.question;
    const resultExposureType = data.resultExposureType;
    const isExposingResult = data.isExposingResult;
    const isEnabledEdit = data.isEnabledEdit;
    const endedAt = data.endedAt;
    const resultEndedAt = data.resultEndedAt;
    const startedAt = data.startedAt;

    console.log(data);
    const voteInfo = await this.dataSource
      .getRepository(VoteInfo)
      .createQueryBuilder('voteInfo')
      .select([
        'id',
        'voteInfo.name as name',
        'question',
        'imageName',
        'divType',
        'resType',
        'alterResType',
        'resultExposureType',
        'isExposingResult',
        'isEnabledEdit',
        'startedAt',
        'endedAt',
        'resultEndedAt',
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
      .where('voteInfo.resultEndedAt >= NOW()')
      .andWhere('voteInfo.id = :voteId', { voteId })
      .getRawOne();

    const voteData = new VoteInfo();
    voteData.id = voteId;
    if (name) voteData.name = name;
    if (question) voteData.question = question;
    if (resultExposureType) voteData.resultExposureType = resultExposureType;
    if (isExposingResult !== null) voteData.isExposingResult = isExposingResult;
    if (isEnabledEdit !== null) voteData.isEnabledEdit = isEnabledEdit;
    if (resultEndedAt) voteData.resultEndedAt = resultEndedAt;
    if (startedAt) voteData.startedAt = startedAt;
    if (endedAt) voteData.endedAt = endedAt;
    if (file) voteData.imageName = file.originalname;
    voteData.adminId = adminId;

    // 진행 중 (시작 일시 빼고 가능)
    if (voteInfo.stateType === VOTE_STATE_TYPE.PROGRESS) {
      if (startedAt) {
        throw new ForbiddenException('수정 할 수 없는 정보 입니다.');
      }
    }
    // 투표 완료 시 결과 노출 일시 만 가능)
    else if (voteInfo.stateType === VOTE_STATE_TYPE.COMPLETED) {
      if (
        name ||
        question ||
        resultExposureType ||
        isExposingResult ||
        isEnabledEdit ||
        startedAt
      ) {
        throw new ForbiddenException('수정 할 수 없는 정보 입니다.');
      }
    } else if (voteInfo.stateType === VOTE_STATE_TYPE.END) {
      throw new ForbiddenException('종료 된 투표 입니다.');
    }

    console.log(voteData);
    this.logger.debug(voteData);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(VoteInfo)
        .createQueryBuilder('voteInfo')
        .update()
        .set(voteData)
        .where('voteInfo.id = :voteId', { voteId })
        .execute();

      if (file) {
        const path = `vote/${voteId}/${file.originalname}`;
        await this.azureBlobService.upload(file, path);
      }

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

  // 투표 상수 조회
  async getVoteConstants() {
    const voteDivType = await this.dataSource.getRepository(VoteDivType).find();
    const voteResType = await this.dataSource.getRepository(VoteResType).find();
    const voteAlterResType = await this.dataSource
      .getRepository(VoteAlterResType)
      .find();
    const voteResultExposureType = await this.dataSource
      .getRepository(VoteResultExposureType)
      .find();
    const voteResultType = await this.dataSource
      .getRepository(VoteResultType)
      .find();
    const voteStateType = await this.dataSource
      .getRepository(VoteStateType)
      .find();

    return {
      voteDivType,
      voteResType,
      voteAlterResType,
      voteResultType,
      voteResultExposureType,
      voteStateType,
    };
  }
  catch(e) {
    this.logger.error({ e });
    throw new HttpException('투표 상수 조회 실패', 500);
  }

  // 투표 결과 정보 조회
  async getVoteResultInfo(voteId: number) {
    try {
      // 투표 확인
      const voteInfo = await this.dataSource.getRepository(VoteInfo).findOne({
        where: {
          id: voteId,
        },
      });

      if (!voteInfo) {
        throw new ForbiddenException('존재하지 않는 투표 입니다.');
      }

      const voteCount = await this.dataSource.manager.query(
        `SELECT vx.num, vx.contents, count(*) AS count FROM memberVoteInfo AS mv 
      left outer join voteInfoExample as vx 
      on mv.num = vx.num and mv.voteId = vx.voteId 
      WHERE mv.voteId = ? 
      GROUP BY vx.num;`,
        [voteId],
      );

      const _voteInfoExample = await this.dataSource
        .getRepository(VoteInfoExample)
        .find({
          where: {
            voteId: voteId,
          },
        });

      const voteInfoExample: any = [];

      for (let index = 0; index < _voteInfoExample.length; index++) {
        const e = _voteInfoExample[index];

        const ex = { type: e.num, name: e.contents };
        voteInfoExample.push(ex);
      }

      const voteRateCount = await this.dataSource
        .getRepository(MemberVoteInfo)
        .count({
          where: {
            voteId: voteId,
          },
        });

      const voteCountInfoList: any = [];
      for (let index = 0; index < voteCount.length; index++) {
        const e: any = voteCount[index];

        const voteCountInfo: any = {};
        voteCountInfo.num = e.num;
        voteCountInfo.contents = e.contents;
        voteCountInfo.count = e.count;
        voteCountInfo.rate = Math.floor((e.count / voteRateCount) * 10000);

        voteCountInfoList.push(voteCountInfo);
      }

      return { voteInfo, voteCountInfoList, voteInfoExample };
    } catch (e) {
      this.logger.error({ e });
      throw new HttpException('투표 결과 정보 조회 실패', 500);
    }
  }

  //투표 결과 리스트 정보 조회
  async getVoteResultListInfo(voteId: number, data: GetVoteResultListInfoDto) {
    const limit = data.limit;
    const searchType = data.searchType || '';
    const searchValue = data.searchValue
      ? decodeURIComponent(data.searchValue)
      : '';
    const filterValue = data.filterValue;
    const lastDt = data.lastDt || '';

    try {
      // 투표 확인
      const voteInfo = await this.dataSource.getRepository(VoteInfo).findOne({
        where: {
          id: voteId,
        },
      });

      if (!voteInfo) {
        throw new ForbiddenException('존재하지 않는 투표 입니다.');
      }

      // 리스트 구하기
      const resultList = await this.dataSource
        .getRepository(MemberVoteInfo)
        .createQueryBuilder('mv')
        .select([
          'member.memberCode as memberCode',
          'member.nickname as nickname',
          'mv.createdAt as createdAt',
          'voteInfoExample.contents as contents',
        ])
        .innerJoin('mv.Member', 'member')
        .innerJoin('mv.VoteInfoExample', 'voteInfoExample')
        .innerJoin('voteInfoExample.VoteInfo', 'voteInfo')
        .where('mv.voteId= :voteId', { voteId: voteId });

      const listCount = await this.dataSource
        .getRepository(MemberVoteInfo)
        .createQueryBuilder('mv')
        .select([
          'member.memberCode as memberCode',
          'member.nickname as nickname',
          'mv.createdAt as createdAt',
          'voteInfoExample.contents as contents',
        ])
        .innerJoin('mv.Member', 'member')
        .innerJoin('mv.VoteInfoExample', 'voteInfoExample')
        .innerJoin('voteInfoExample.VoteInfo', 'voteInfo')
        .where('mv.voteId= :voteId', { voteId: voteId });

      // // 필터 값이 있는 경우
      if (filterValue > 0) {
        resultList.andWhere('mv.num = :num', { num: filterValue });
        listCount.andWhere('mv.num = :num', { num: filterValue });
      }

      switch (searchType) {
        case SEARCH_TYPE.MEMBER_CODE:
          resultList.andWhere('member.memberCode = :memberCode', {
            memberCode: searchValue,
          });
          listCount.andWhere('member.memberCode = :memberCode', {
            memberCode: searchValue,
          });

          break;

        case SEARCH_TYPE.NICKNAME:
          resultList.andWhere('member.nickname like :nickname', {
            nickname: `%${searchValue}%`,
          });
          listCount.andWhere('member.nickname like :nickname', {
            nickname: `%${searchValue}%`,
          });
          break;

        case SEARCH_TYPE.DIV_TYPE:
          resultList.andWhere('voteInfo.divType = :divType', {
            divType: searchValue,
          });
          listCount.andWhere('voteInfo.divType = :divType', {
            divType: searchValue,
          });
          break;

        case SEARCH_TYPE.STATE_TYPE:
          if (Number(searchValue) === VOTE_STATE_TYPE.COMPLETED) {
            resultList.andWhere(
              'voteInfo.endedAt < NOW() and voteInfo.resultEndedAt > NOW()',
            );
            listCount.andWhere(
              'voteInfo.endedAt < NOW() and voteInfo.resultEndedAt > NOW()',
            );
          } else if (Number(searchValue) === VOTE_STATE_TYPE.END) {
            resultList.andWhere('voteInfo.resultEndedAt < NOW()');
            listCount.andWhere('voteInfo.resultEndedAt < NOW()');
          } else if (Number(searchValue) === VOTE_STATE_TYPE.PROGRESS) {
            resultList.andWhere(
              'voteInfo.startedAt < NOW() and voteInfo.endedAt > NOW()',
            );
            listCount.andWhere(
              'voteInfo.startedAt < NOW() and voteInfo.endedAt > NOW()',
            );
          }
          break;
      }

      if (lastDt) {
        resultList.andWhere('mv.createdAt > :dateTime', {
          dateTime: `${UnixTimestamp(Number(path.parse(String(lastDt)).base))}`,
        });
        listCount.andWhere('mv.createdAt > :dateTime', {
          dateTime: `${UnixTimestamp(Number(path.parse(String(lastDt)).base))}`,
        });
      }

      resultList.orderBy('mv.createdAt', 'ASC');
      resultList.limit(limit);

      const row = await resultList.getRawMany();
      const count = await listCount.getCount();

      const voteResultList = { row, count };
      return { voteResultList, filterValue, searchType, searchValue };
    } catch (e) {
      this.logger.error({ e });
      throw new HttpException('투표 결과 리스트 정보 조회 실패', 500);
    }
  }
}
