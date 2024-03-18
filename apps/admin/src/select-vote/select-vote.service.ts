import { AzureBlobService } from '@libs/common';
import {
  ADMIN_PAGE,
  FUNCTION_TABLE,
  SEARCH_TYPE,
  SELECT_VOTE_STATE_TYPE,
} from '@libs/constants';
import {
  FunctionTable,
  MemberSelectVoteInfo,
  SelectVoteInfo,
  SelectVoteItem,
  SelectVoteStateType,
  VoteResultType,
  VoteResultExposureType,
} from '@libs/entity';
import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTableDto } from '../common/dto/get.table.dto';
import {
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { CreateSelectVoteDto } from './dto/req/create.select.vote.dto';
import { UpdateSelectVoteDto } from './dto/req/update.select.vote.dto';
import { CreateSelectVoteItemDto } from './dto/req/create.select.vote.item.dto';
import { UpdateSelectVoteItemDto } from './dto/req/update.select.vote.item.dto';
import { UpdateSelectVoteItemListDto } from './dto/req/update.select.vote.item.list.dto';

@Injectable()
export class SelectVoteService {
  constructor(
    @InjectRepository(SelectVoteInfo)
    private selectVoteRepository: Repository<SelectVoteInfo>,
    private azureBlobService: AzureBlobService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(SelectVoteService.name);

  // 투표 상수 조회
  async getVoteConstants() {
    const voteResultExposureType = await this.dataSource
      .getRepository(VoteResultExposureType)
      .find();
    const voteResultType = await this.dataSource
      .getRepository(VoteResultType)
      .find();
    const selectVoteStateType = await this.dataSource
      .getRepository(SelectVoteStateType)
      .find();

    return { voteResultType, voteResultExposureType, selectVoteStateType };
  }
  catch(e) {
    this.logger.error({ e });
    throw new HttpException('투표 상수 조회 실패', 500);
  }

  // 투표 리스트 조회
  async getVoteList(data: GetTableDto) {
    const page = data?.page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    const searchType = data.searchType ? data.searchType : '';
    const searchValue = data.searchValue ? data.searchValue : '';

    try {
      const voteList = await this.dataSource
        .getRepository(SelectVoteInfo)
        .createQueryBuilder('v')
        .select([
          'v.id as id',
          'v.name as name',
          'v.resultType as resultType',
          'resultType.name as resultTypename',
          'v.resultExposureType as resultExposureType',
          'exposureType.name as resultExposureTypeName',
          'v.startedAt as startedAt',
          'v.endedAt as endedAt',
          'v.resultStartedAt as resultStartedAt',
          'v.resultEndedAt as resultEndedAt',
        ])
        .addSelect(
          `CASE
                WHEN v.resultEndedAt < now() THEN '투표 종료'
                WHEN v.startedAt > now() THEN '예정'
                WHEN v.startedAt < now() and v.endedAt > now() and v.resultStartedAt < now() THEN '투표 진행 & 결과 노출'
                WHEN v.startedAt < now() and v.endedAt > now() and v.resultStartedAt > now() THEN '투표 진행 & 결과 미노출'
                WHEN v.endedAt < now() and resultStartedAt > now() THEN '투표 종료 & 결과 노출 대기'
                WHEN v.endedAt < now() and resultStartedAt < now() and v.resultEndedAt > now() THEN '투표 종료 & 결과 노출'
                
            END`,
          'stateName',
        )
        .addSelect(
          `CASE
                WHEN v.resultEndedAt < now() THEN 6
                WHEN v.startedAt > now() THEN 1
                WHEN v.startedAt < now() and v.endedAt > now() and v.resultStartedAt < now() THEN 2
                WHEN v.startedAt < now() and v.endedAt > now() and v.resultStartedAt > now() THEN 3
                WHEN v.endedAt < now() and v.resultStartedAt > now() THEN 4
                WHEN v.endedAt < now() and v.resultStartedAt < now() and v.resultEndedAt > now() THEN 5
                
          END`,
          'stateType',
        )
        .addSelect(
          `CASE
            WHEN COUNT(voteItem.voteId) >= 2 THEN 1
            ELSE 0
          END`,
          'hasItem',
        )
        .leftJoin('v.VoteResultType', 'resultType')
        .leftJoin('v.VoteResultExposureType', 'exposureType')
        .leftJoin('v.SelectVoteItems', 'voteItem')
        .groupBy('v.id')
        .offset(offset)
        .limit(limit);

      const voteCount = await this.dataSource
        .getRepository(SelectVoteInfo)
        .createQueryBuilder('v');

      console.log(
        '@@@@@@@@@@@@@@@@@@@@@@@@@ searchType @@@@@@@@@@@@@@@@@ : ',
        searchType,
      );
      console.log(
        '@@@@@@@@@@@@@@@@@@@@@@@@@ searchValue @@@@@@@@@@@@@@@@@ : ',
        searchValue,
      );
      /**
       *     SCHEDULED: 1;
    PROGRESS_RESULT: 2;
    PROGRESS_NOT_RESULT: 3;
    COMPLETED_NOT_RESULT: 4;
    COMPLETED_RESULT: 5;
    END: 6;
       */
      switch (searchType) {
        case SEARCH_TYPE.STATE_TYPE:
          if (Number(searchValue) === SELECT_VOTE_STATE_TYPE.SCHEDULED) {
            // 예정
            voteList.andWhere('v.startedAt > NOW()');
            voteCount.andWhere('v.startedAt > NOW()');
          } else if (
            Number(searchValue) === SELECT_VOTE_STATE_TYPE.PROGRESS_RESULT
          ) {
            // 투표 진행 & 결과 노출
            voteList.andWhere(
              'v.startedAt < NOW() and v.endedAt > NOW() and v.resultStartedAt < NOW()',
            );
            voteCount.andWhere(
              'v.startedAt < NOW() and v.endedAt > NOW() and v.resultStartedAt < NOW()',
            );
          } else if (
            Number(searchValue) === SELECT_VOTE_STATE_TYPE.PROGRESS_NOT_RESULT
          ) {
            // 투표 진행 & 미 결과 노출
            voteList.andWhere(
              'v.startedAt < NOW() and v.endedAt > NOW() and v.resultStartedAt > NOW()',
            );

            voteCount.andWhere(
              'v.startedAt < NOW() and v.endedAt > NOW() and v.resultStartedAt > NOW()',
            );
          } else if (Number(searchValue) === SELECT_VOTE_STATE_TYPE.END) {
            // 투표 종료
            voteList.andWhere('v.resultEndedAt < NOW()');
            voteCount.andWhere('v.resultEndedAt < NOW()');
          } else if (
            Number(searchValue) === SELECT_VOTE_STATE_TYPE.COMPLETED_NOT_RESULT
          ) {
            // 투표 종료 & 결과 노출 대기
            voteList.andWhere(
              'v.endedAt < NOW() and v.resultStartedAt > NOW()',
            );
            voteCount.andWhere(
              'v.endedAt < NOW() and v.resultStartedAt > NOW()',
            );
          } else if (
            Number(searchValue) === SELECT_VOTE_STATE_TYPE.COMPLETED_RESULT
          ) {
            // 투표 종료 & 결과 노출
            voteList.andWhere(
              'v.endedAt < NOW() and v.resultStartedAt < NOW() and v.resultEndedAt > NOW()',
            );
            voteCount.andWhere(
              'v.endedAt < NOW() and v.resultStartedAt < NOW() and v.resultEndedAt > NOW()',
            );
          }

          break;
        case SEARCH_TYPE.NAME:
          voteList.andWhere('v.name like :name', {
            name: `%${searchValue}%`,
          });
          voteCount.andWhere('v.name like :name', {
            name: `%${searchValue}%`,
          });
          break;
        default:
          break;
      }

      const rows = await voteList.getRawMany();
      const count = await voteCount.getRawMany();

      return { rows, count: count.length };
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException('투표 목록 조회 실패', 500);
    }
  }

  // 선택 투표 조회
  async getVote(voteId: number) {
    try {
      const vote = await this.selectVoteRepository
        .createQueryBuilder('v')
        .select([
          'v.id as id',
          'v.name as name',
          'v.resultType as resultType',
          'resultType.name as resultTypename',
          'v.resultExposureType as resultExposureType',
          'exposureType.name as resultExposureTypeName',
          'v.voteCount as voteCount',
          'v.startedAt as startedAt',
          'v.endedAt as endedAt',
          'v.resultStartedAt as resultStartedAt',
          'v.resultEndedAt as resultEndedAt',
        ])
        .addSelect(
          `CASE
                WHEN v.startedAt > now() THEN '예정'
                WHEN v.startedAt < now() and v.endedAt > now() and resultStartedAt < now() THEN '투표 진행 & 결과 노출'
                WHEN v.startedAt < now() and v.endedAt > now() and resultStartedAt > now() THEN '투표 진행 & 결과 미노출'
                WHEN v.endedAt < now() and resultStartedAt > now() THEN '투표 종료 & 결과 노출 대기'
                WHEN v.endedAt < now() and resultStartedAt < now() and resultEndedAt > now() THEN '투표 종료 & 결과 노출'
                WHEN v.resultEndedAt < now() THEN '투표 종료'
            END`,
          'stateName',
        )
        .addSelect(
          `CASE
                WHEN v.startedAt > now() THEN 1
                WHEN v.startedAt < now() and v.endedAt > now() and resultStartedAt < now() THEN 2
                WHEN v.startedAt < now() and v.endedAt > now() and resultStartedAt > now() THEN 3
                WHEN v.endedAt < now() and resultStartedAt > now() THEN 4
                WHEN v.endedAt < now() and resultStartedAt < now() and resultEndedAt > now() THEN 5
                WHEN v.resultEndedAt < now() THEN 6
          END`,
          'stateType',
        )
        .where('v.id = :voteId', { voteId })
        .innerJoin('v.VoteResultType', 'resultType')
        .innerJoin('v.VoteResultExposureType', 'exposureType')
        .getRawOne();

      return vote;
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException('투표 조회 실패', 500);
    }
  }

  // 선택 투표 생성
  async createSelectVote(userId: number, data: CreateSelectVoteDto) {
    const functionTables = await this.dataSource
      .getRepository(FunctionTable)
      .find();

    let VOTE_MAX_COUNT;
    let VOTE_MIN_COUNT;

    for (const func of functionTables) {
      switch (func.id) {
        case FUNCTION_TABLE.VOTE_MAX_COUNT:
          VOTE_MAX_COUNT = func.value;
          break;
        case FUNCTION_TABLE.VOTE_MIN_COUNT:
          VOTE_MIN_COUNT = func.value;
          break;

        default:
          break;
      }
    }
    // 투표권 개수 체크
    if (data.voteCount < VOTE_MIN_COUNT || data.voteCount > VOTE_MAX_COUNT) {
      throw new ForbiddenException('투표권 갯수 오류');
    }

    const startedAt = new Date(data.startedAt);
    const endedAt = new Date(data.endedAt);
    const resultStartedAt = new Date(data.resultStartedAt);
    const resultEndedAt = new Date(data.resultEndedAt);

    if (resultEndedAt < endedAt) {
      throw new ForbiddenException(
        '종료 일시가 결과 노출 종료 일시 보다 작아야 합니다.',
      );
    }

    if (startedAt >= endedAt) {
      throw new ForbiddenException('시작 일시가 종료 일시 보다 작아야 합니다.');
    }

    if (resultStartedAt >= resultEndedAt) {
      throw new ForbiddenException(
        '결과 노출 시작 일시가 결과 노출 종료 일시 보다 작아야 합니다.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exInfo = await this.selectVoteRepository.findOne({
        where: {
          startedAt: LessThanOrEqual(resultEndedAt),
          resultEndedAt: MoreThanOrEqual(startedAt),
        },
      });

      if (exInfo) {
        throw new ForbiddenException('이미 등록 된 투표가 있음');
      }

      const info = new SelectVoteInfo();
      info.name = data.name;
      info.resultType = data.resultType;
      info.resultExposureType = data.resultExposureType;
      info.voteCount = data.voteCount;
      info.startedAt = startedAt;
      info.endedAt = endedAt;
      info.resultStartedAt = resultStartedAt;
      info.resultEndedAt = resultEndedAt;
      info.adminId = userId;

      await queryRunner.manager.getRepository(SelectVoteInfo).save(info);

      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    } finally {
      await queryRunner.release();
    }
  }

  // 투표 항목 상세 조회
  async getDetailItem(voteId) {
    try {
      const voteItems = await this.dataSource
        .getRepository(SelectVoteItem)
        .createQueryBuilder('i')
        .select([
          'i.itemNum as itemNum',
          'i.displayNum as displayNum',
          'i.name as name',
          'i.description as description',
          'i.videoUrl as videoUrl',
          'i.imageName as imageName',
        ])
        .where('i.voteId = :voteId', { voteId })
        .orderBy('i.displayNum', 'ASC')
        .getRawMany();

      return { voteItems };
    } catch (error) {}
  }

  // 투표 항목 추가
  async createSelectVoteItem(
    userId: number,
    voteId: number,
    data: CreateSelectVoteItemDto,
    file: Express.Multer.File,
  ) {
    const functionTables = await this.dataSource
      .getRepository(FunctionTable)
      .find();

    let VOTE_ITEM_MAX_COUNT;
    let VOTE_ITEM_MIN_COUNT;
    let VOTE_MAX_COUNT;
    let VOTE_MIN_COUNT;

    for (const func of functionTables) {
      switch (func.id) {
        case FUNCTION_TABLE.VOTE_ITEM_MAX_COUNT:
          VOTE_ITEM_MAX_COUNT = func.value;
          break;
        case FUNCTION_TABLE.VOTE_ITEM_MIN_COUNT:
          VOTE_ITEM_MIN_COUNT = func.value;
          break;
        default:
          break;
      }
    }

    const itemCount = await this.dataSource
      .getRepository(SelectVoteItem)
      .count({ where: { voteId: voteId } });

    // 투표 항목 개수 체크
    if (itemCount >= VOTE_ITEM_MAX_COUNT) {
      throw new ForbiddenException('투표 항목 갯수 오류');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 항목 검증
      const voteItem = await this.dataSource
        .getRepository(SelectVoteItem)
        .findOne({
          where: {
            voteId: voteId,
            itemNum: data.itemNum,
          },
        });

      if (voteItem) {
        throw new ForbiddenException('항목 번호가 이미 있습니다.');
      }

      const newItem = new SelectVoteItem();
      newItem.voteId = voteId;
      newItem.itemNum = data.itemNum;
      newItem.displayNum = data.displayNum;
      newItem.name = data.name;
      newItem.description = data.description;
      newItem.videoUrl = data.videoUrl;
      newItem.imageName = file.originalname;
      await queryRunner.manager.getRepository(SelectVoteItem).save(newItem);

      const path = `select-vote/${voteId}/${data.itemNum}/${file.originalname}`;
      await this.azureBlobService.upload(file, path);

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    } finally {
      await queryRunner.release();
    }
  }

  // 선택 투표 수정
  async updateSelectVote(
    userId: number,
    voteId: number,
    data: UpdateSelectVoteDto,
  ) {
    const currentDate = new Date();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exVoteInfo = await this.selectVoteRepository.findOne({
        select: ['startedAt', 'endedAt', 'resultStartedAt', 'resultEndedAt'],
        where: {
          id: voteId,
        },
      });

      if (!exVoteInfo) {
        throw new ForbiddenException('존재 하지 않는 투표 입니다.');
      }

      const currentStateType = this.getSelectVoteState(
        exVoteInfo.startedAt,
        exVoteInfo.endedAt,
        exVoteInfo.resultStartedAt,
        exVoteInfo.resultEndedAt,
      );

      // 투표 종료
      if (currentStateType === SELECT_VOTE_STATE_TYPE.END) {
        throw new ForbiddenException('투표가 종료 되었습니다.');
      }

      const startedAt = new Date(data.startedAt);
      const endedAt = new Date(data.endedAt);
      const resultStartedAt = new Date(data.resultStartedAt);
      const resultEndedAt = new Date(data.resultEndedAt);

      // 투표가 예정인 경우
      if (currentStateType === SELECT_VOTE_STATE_TYPE.SCHEDULED) {
      }

      // 투표가 진행 중이고 결과 노출인 경우
      if (currentStateType === SELECT_VOTE_STATE_TYPE.PROGRESS_RESULT) {
        // 시작 일시 변경 불가
        if (startedAt.getTime() !== exVoteInfo.startedAt.getTime()) {
          console.log(
            `startedAt: ${startedAt} exVoteInfo.startedAt : ${exVoteInfo.startedAt}`,
          );
          throw new ForbiddenException('변경 불가 : startedAt');
        }

        // 투표권 개수 변경 불가
        if (data.voteCount) {
          throw new ForbiddenException('변경 불가 : voteCount');
        }
      }

      // 투표가 진행 중이고 결과 미노출인 경우
      if (currentStateType === SELECT_VOTE_STATE_TYPE.PROGRESS_NOT_RESULT) {
        // 시작 일시 변경 불가
        if (startedAt.getTime() !== exVoteInfo.startedAt.getTime()) {
          console.log(
            `startedAt: ${startedAt} exVoteInfo.startedAt : ${exVoteInfo.startedAt}`,
          );
          throw new ForbiddenException('변경 불가 : startedAt');
        }
        // 투표권 개수 변경 불가
        if (data.voteCount) {
          throw new ForbiddenException('변경 불가 : voteCount');
        }
      }

      // 투표가 종료 되고, 결과 노출 대기인 경우
      if (currentStateType === SELECT_VOTE_STATE_TYPE.COMPLETED_NOT_RESULT) {
        // 시작 일시 변경 불가
        if (startedAt.getTime() !== exVoteInfo.startedAt.getTime()) {
          console.log(
            `startedAt: ${startedAt} exVoteInfo.startedAt : ${exVoteInfo.startedAt}`,
          );
          throw new ForbiddenException('변경 불가 : startedAt');
        }

        // 종료 일시 변경 불가
        if (endedAt.getTime() !== exVoteInfo.endedAt.getTime()) {
          throw new ForbiddenException('변경 불가 : endedAt');
        }

        // 투표권 개수 변경 불가
        if (data.voteCount) {
          throw new ForbiddenException('변경 불가 : voteCount');
        }
      }

      // 투표가 종료 되고, 결과 노출인 경우
      if (currentStateType === SELECT_VOTE_STATE_TYPE.COMPLETED_RESULT) {
        // 시작 일시 변경 불가
        if (startedAt.getTime() !== exVoteInfo.startedAt.getTime()) {
          console.log(
            `startedAt: ${startedAt} exVoteInfo.startedAt : ${exVoteInfo.startedAt}`,
          );
          throw new ForbiddenException('변경 불가 : startedAt');
        }

        // 종료 일시 변경 불가
        if (endedAt.getTime() !== exVoteInfo.endedAt.getTime()) {
          throw new ForbiddenException('변경 불가 : endedAt');
        }

        // 투표권 개수 변경 불가
        if (data.voteCount) {
          throw new ForbiddenException('변경 불가');
        }

        // 결과 노출 시작 일시 변경 불가
        if (
          resultStartedAt.getTime() !== exVoteInfo.resultStartedAt.getTime()
        ) {
          throw new ForbiddenException('변경 불가 : resultStartedAt');
        }
      }

      if (resultEndedAt < endedAt) {
        throw new ForbiddenException(
          '종료 일시가 결과 노출 종료 일시 보다 작아야 합니다.',
        );
      }

      if (startedAt >= endedAt) {
        throw new ForbiddenException(
          '시작 일시가 종료 일시 보다 작아야 합니다.',
        );
      }

      if (resultStartedAt >= resultEndedAt) {
        throw new ForbiddenException(
          '결과 노출 시작 일시가 결과 노출 종료 일시 보다 작아야 합니다.',
        );
      }

      const otherInfo = await this.selectVoteRepository.findOne({
        where: {
          startedAt: LessThanOrEqual(resultEndedAt),
          resultEndedAt: MoreThanOrEqual(startedAt),
          id: Not(voteId),
        },
      });

      if (otherInfo) {
        throw new ForbiddenException('이미 등록 된 투표가 있음');
      }

      const newVoteInfo = new SelectVoteInfo();
      newVoteInfo.id = voteId;
      if (data.name) newVoteInfo.name = data.name;
      if (data.resultType) newVoteInfo.resultType = data.resultType;
      if (data.resultExposureType)
        newVoteInfo.resultExposureType = data.resultExposureType;
      if (data.voteCount) newVoteInfo.voteCount = data.voteCount;

      newVoteInfo.startedAt = startedAt;
      newVoteInfo.endedAt = endedAt;
      newVoteInfo.resultStartedAt = resultStartedAt;
      newVoteInfo.resultEndedAt = resultEndedAt;
      newVoteInfo.adminId = userId;

      await queryRunner.manager.getRepository(SelectVoteInfo).save(newVoteInfo);

      await queryRunner.commitTransaction();

      return HttpStatus.OK;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    } finally {
      await queryRunner.release();
    }
  }

  // 투표 삭제
  async deleteSelectVote(voteId: number) {
    const currentDate = new Date();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exVoteInfo = await this.selectVoteRepository.findOne({
        select: ['startedAt', 'endedAt', 'resultStartedAt', 'resultEndedAt'],
        where: {
          id: voteId,
        },
      });

      if (!exVoteInfo) {
        throw new ForbiddenException('존재 하지 않는 투표 입니다.');
      }

      // 투표 종료
      if (exVoteInfo.endedAt < currentDate) {
        throw new ForbiddenException('투표가 종료 되었습니다.');
      }

      // 진행 중이다.
      if (exVoteInfo.startedAt < currentDate) {
        throw new ForbiddenException('투표가 진행 중 입니다.');
      }

      await queryRunner.manager
        .getRepository(SelectVoteInfo)
        .delete({ id: voteId });

      // 이미지 삭제
      await this.azureBlobService.deleteFolder(`select-vote/${voteId}`);

      await queryRunner.commitTransaction();

      return HttpStatus.OK;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    } finally {
      await queryRunner.release();
    }
  }

  // 항목 수정
  async updateSelectVoteItem(
    userId: number,
    voteId: number,
    data: UpdateSelectVoteItemDto,
    file: Express.Multer.File,
  ) {
    console.log(file);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 항목 검증
      const voteItem = await this.dataSource
        .getRepository(SelectVoteItem)
        .findOne({
          where: {
            voteId: voteId,
            itemNum: data.itemNum,
          },
        });

      if (!voteItem) {
        throw new ForbiddenException('존재하지 않는 항목입니다.');
      }

      const newItem = new SelectVoteItem();
      if (data.name) newItem.name = data.name;
      if (data.description) newItem.description = data.description;
      if (data.videoUrl) newItem.videoUrl = data.videoUrl;
      if (file) newItem.imageName = file.originalname;

      await queryRunner.manager
        .getRepository(SelectVoteItem)
        .update({ voteId: voteId, itemNum: data.itemNum }, newItem);

      if (file) {
        await this.azureBlobService.deleteFolder(
          `select-vote/${voteId}/${data.itemNum}`,
        );
        const path = `select-vote/${voteId}/${data.itemNum}/${file.originalname}`;
        await this.azureBlobService.upload(file, path);
      }
      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    } finally {
      await queryRunner.release();
    }
  }

  // 항목 리스트 편집
  async updateVoteItemList(
    adminId: number,
    voteId: number,
    data: UpdateSelectVoteItemListDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 삭제할 목록이 있는 경우
      if (data.deleteItems) {
        for (const item of data.deleteItems) {
          const exItem = await this.dataSource
            .getRepository(SelectVoteItem)
            .findOne({
              where: {
                voteId: voteId,
                itemNum: item,
              },
            });

          if (!exItem) {
            throw new ForbiddenException('존재하지 않는 항목입니다.');
          }

          const cond = {
            voteId: voteId,
            itemNum: item,
          };

          await queryRunner.manager.getRepository(SelectVoteItem).delete(cond);
        }
      }

      // 순서 변경 할 목록이 있는 경우
      if (data.voteItems) {
        if (data.voteItems.length < 2) {
          throw new ForbiddenException('항목은 2개 이상이어야 합니다.');
        }

        for (const item of data.voteItems) {
          const exItem = await this.dataSource
            .getRepository(SelectVoteItem)
            .findOne({
              where: {
                voteId: voteId,
                itemNum: item.itemNum,
              },
            });

          if (!exItem) {
            throw new ForbiddenException('존재하지 않는 항목입니다.');
          }

          const cond = {
            voteId: voteId,
            itemNum: item.itemNum,
          };

          await queryRunner.manager.getRepository(SelectVoteItem).update(cond, {
            displayNum: item.displayNum,
          });
        }
      }

      // 순서 중복 체크
      const distinctResult = await queryRunner.query(
        `SELECT DISTINCT displayNum FROM selectvoteitem where voteId = ? `,
        [voteId],
      );
      const totalResult = await queryRunner.query(
        `SELECT displayNum FROM selectvoteitem where voteId = ? `,
        [voteId],
      );
      const hasDuplicate = distinctResult.length < totalResult.length;

      if (hasDuplicate) {
        throw new ForbiddenException('노출 순서 번호가 중복 입니다.');
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    } finally {
      await queryRunner.release();
    }
  }

  // 항목 삭제
  async deleteSelectVoteItem(userId: number, voteId: number, itemNum: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 항목 검증
      const voteItem = await this.dataSource
        .getRepository(SelectVoteItem)
        .findOne({
          where: {
            voteId: voteId,
            itemNum: itemNum,
          },
        });

      if (!voteItem) {
        throw new ForbiddenException('존재하지 않는 항목입니다.');
      }

      await queryRunner.manager
        .getRepository(SelectVoteItem)
        .delete({ voteId: voteId, itemNum: itemNum });

      await this.azureBlobService.deleteFolder(
        `select-vote/${voteId}/${itemNum}`,
      );
      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new ForbiddenException('DB falied!!');
      }
    } finally {
      await queryRunner.release();
    }
  }

  // 투표 결과 조회
  async getResult(voteId: number) {
    const currentDate = new Date();

    try {
      // 투표 정보 조회 (제목, 투표 기간, 결과 노출 기간 )
      const voteInfo = await this.selectVoteRepository.findOne({
        select: [
          'id',
          'name',
          'startedAt',
          'endedAt',
          'resultStartedAt',
          'resultEndedAt',
        ],
        where: { id: voteId, startedAt: LessThanOrEqual(currentDate) },
      });

      // 결과 검색 가능 여부 확인
      if (!voteInfo) {
        throw new ForbiddenException('결과 검색을 할 수 없습니다.');
      }

      // 투표 요약 ( 항목별 번호, 이름, 득표수, 득표율 )

      const subQuery = await this.dataSource
        .getRepository(MemberSelectVoteInfo)
        .createQueryBuilder()
        .select('COUNT(*) as count')
        .where('voteId = :voteId', { voteId });

      const voteItems = await this.dataSource
        .getRepository(SelectVoteItem)
        .createQueryBuilder('vi')
        .select([
          'vi.itemNum as itemNum',
          'vi.name as name',
          'count(mVoteInfos.voteId) as voteCount',
          `count(mVoteInfos.voteId) /(${subQuery.getQuery()}) as rate`,
        ])

        .where('vi.voteId = :voteId', { voteId })
        .leftJoin('vi.MemberSelectVoteInfos', 'mVoteInfos')
        .groupBy('vi.voteId')
        .addGroupBy('vi.name')
        .orderBy('vi.itemNum', 'ASC')
        .getRawMany();

      const voteResponse = await subQuery.getRawOne();
      console.log(voteResponse.count);
      const voteSummary = { totalCount: Number(voteResponse.count), voteItems };
      const voteResults = { voteInfo, voteSummary };

      return voteResults;
    } catch (e) {
      console.log(e);
      throw new ForbiddenException('DB falied!!');
    }
  }

  async getMemberVoteList(voteId: number, req: GetTableDto) {
    const page = req.page || 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;
    const searchType = req.searchType;
    const searchValue = req.searchValue;

    try {
      const memberVotes = await this.dataSource
        .getRepository(MemberSelectVoteInfo)
        .createQueryBuilder('msvi')
        .select([
          'member.memberCode as memberCode',
          'member.nickName as nickName',
          'ktmf.email as email',
          'msvi.createdAt as createdAt',
          'msvi.itemNum as itemNum',
          'voteItem.name as name',
        ])
        .where('msvi.voteId = :voteId', { voteId })
        .innerJoin('msvi.Member', 'member')
        .innerJoin('msvi.SelectVoteItem', 'voteItem')
        .leftJoin('member.KtmfEventEmailInfo', 'ktmf')
        .limit(limit)
        .offset(offset);

      const memberVotesCount = await this.dataSource
        .getRepository(MemberSelectVoteInfo)
        .createQueryBuilder('msvi')
        .select([
          'member.memberCode as memberCode',
          'member.nickName as nickName',
          'ktmf.email as email',
          'msvi.createdAt as createdAt',
          'msvi.itemNum as itemNum',
          'voteItem.name as name',
        ])
        .where('msvi.voteId = :voteId', { voteId })
        .innerJoin('msvi.Member', 'member')
        .innerJoin('msvi.SelectVoteItem', 'voteItem')
        .leftJoin('member.KtmfEventEmailInfo', 'ktmf');

      if (searchType) {
        if (searchType === SEARCH_TYPE.MEMBER_CODE) {
          memberVotes.andWhere('member.memberCode like :memberCode', {
            memberCode: `%${searchValue}%`,
          });
          memberVotesCount.andWhere('member.memberCode like :memberCode', {
            memberCode: `%${searchValue}%`,
          });
        } else if (searchType === SEARCH_TYPE.NICKNAME) {
          memberVotes.andWhere('member.nickName like :nickName', {
            nickName: `%${searchValue}%`,
          });
          memberVotesCount.andWhere('member.nickName like :nickName', {
            nickName: `%${searchValue}%`,
          });
        } else if (searchType === SEARCH_TYPE.VOTE_ITEM_NUM) {
          memberVotes.andWhere('msvi.itemNum = :itemNum', {
            itemNum: Number(searchValue),
          });
          memberVotesCount.andWhere('msvi.itemNum = :itemNum', {
            itemNum: Number(searchValue),
          });
        }
      }

      const memberVoteList = await memberVotes.getRawMany();
      const count = await memberVotesCount.getCount();

      console.log(memberVoteList);
      return { count, memberVoteList };
    } catch (e) {
      console.log(e);
      throw new ForbiddenException('DB falied!!');
    }
  }

  // 회원 투표 Excel 리스트
  async getMemberVoteExcelList(voteId: number) {
    try {
      const memberVotes = await this.dataSource
        .getRepository(MemberSelectVoteInfo)
        .createQueryBuilder('msvi')
        .select([
          'member.memberCode as memberCode',
          'member.nickname as nickname',
          'ktmf.email as email',
          'msvi.createdAt as createdAt',
          'msvi.itemNum as itemNum',
          'voteItem.name as name',
        ])
        .where('msvi.voteId = :voteId', { voteId })
        .innerJoin('msvi.Member', 'member')
        .innerJoin('msvi.SelectVoteItem', 'voteItem')
        .leftJoin('member.KtmfEventEmailInfo', 'ktmf')
        .getRawMany();

      return memberVotes;
    } catch (e) {
      console.log(e);
      throw new ForbiddenException('DB falied!!');
    }
  }
  //////////////////////////////////////
  //
  // 선택 투표 아이템 유효성 검증
  //
  //////////////////////////////////////
  // async validateSelectVoteItem(data: any) {
  //   const selectVoteItem = new SelectVoteItemDto();

  //   selectVoteItem.itemNum = data.itemNum;
  //   selectVoteItem.name = data.name;
  //   selectVoteItem.description = data.description;
  //   selectVoteItem.videoUrl = data.videoUrl;
  //   selectVoteItem.imageName = data.imageName;
  //   selectVoteItem.displayNum = data.displayNum;

  //   const validationErrors = await validate(selectVoteItem);

  //   console.log('########################### validationErrors: ', validationErrors);
  //   if (validationErrors.length > 0) {
  //     throw new ForbiddenException(validationErrors, 'Validation failed');
  //   }

  //   return selectVoteItem;
  // }

  //////////////////////////////////////
  //
  // 선택 투표 기간 체크 (해당 기간에 투표 존재 여부)
  //
  //////////////////////////////////////

  async checkSelectVotePeriod(startedAt: Date, endedAt: Date) {
    if (startedAt >= endedAt) {
      throw new ForbiddenException('시작 일시는 종료일시 보다 클 수 없다.');
    }
  }

  getSelectVoteState(
    startedAt: Date,
    endedAt: Date,
    resultStartedAt: Date,
    resultEndedAt: Date,
  ) {
    const currentDate = new Date();

    // 예정인 경우
    if (startedAt > currentDate) {
      return SELECT_VOTE_STATE_TYPE.SCHEDULED;
    }
    // 투표가 진행 중이고 결과 노출인 경우
    if (
      startedAt < currentDate &&
      endedAt > currentDate &&
      resultStartedAt < currentDate &&
      resultEndedAt > currentDate
    ) {
      return SELECT_VOTE_STATE_TYPE.PROGRESS_RESULT;
    }

    // 투표가 진행 중이고 결과 미노출인 경우
    if (
      startedAt < currentDate &&
      endedAt > currentDate &&
      resultStartedAt > currentDate
    ) {
      return SELECT_VOTE_STATE_TYPE.PROGRESS_NOT_RESULT;
    }

    // 투표가 종료 되고, 결과 노출 대기인 경우
    if (endedAt < currentDate && resultStartedAt > currentDate) {
      return SELECT_VOTE_STATE_TYPE.COMPLETED_NOT_RESULT;
    }

    // 투표가 종료 되고, 결과 노출인 경우
    if (
      endedAt < currentDate &&
      resultStartedAt < currentDate &&
      resultEndedAt > currentDate
    ) {
      return SELECT_VOTE_STATE_TYPE.COMPLETED_RESULT;
    }

    // 투표가 종료 된 경우
    if (resultEndedAt < currentDate) {
      return SELECT_VOTE_STATE_TYPE.END;
    }
  }
}
