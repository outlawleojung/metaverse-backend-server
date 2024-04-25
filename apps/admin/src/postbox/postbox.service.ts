import { PostboxSendService } from './../services/postbox.send.service';
import { GetTableDto } from './../common/dto/get.table.dto';
import {
  AppendType,
  CategoryType,
  Item,
  ItemType,
  LogActionType,
  Member,
  MemberPostbox,
  MoneyType,
  PostReceiveMemberInfo,
  PostalEffectType,
  PostalLog,
  PostalLogType,
  PostalSendType,
  PostalState,
  PostalType,
  Postbox,
  PostboxAppend,
  Admin,
} from '@libs/entity';
import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository, Brackets } from 'typeorm';
import {
  ADMIN_PAGE,
  APPEND_TYPE,
  FRND_REQUEST_TYPE,
  ITEM_TYPE,
  LOG_ACTION_TYPE,
  POSTAL_SEND_TYPE,
  POSTAL_STATE,
  SEARCH_TYPE,
} from '@libs/constants';
import { EndedUnixTimestamp, StartedUnixTimestamp } from '@libs/common';
import dayjs from 'dayjs';
import { SendFullMailingDto } from './dto/req/send.full.mailing.dto';
import { SendEachMailingDto } from './dto/req/send.each.mailing.dto';
import { UpdteMailingDto } from './dto/req/update.mailing.dto';
import { PostalLogService } from './postal.log.service';
import { GetLogDto } from './dto/req/get.log.dto';
import { GetItemDto } from './dto/req/get.item.dto';

@Injectable()
export class PostboxService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(Postbox) private postboxRepository: Repository<Postbox>,
    @InjectRepository(PostboxAppend)
    private postboxAppendRepository: Repository<PostboxAppend>,
    @InjectRepository(PostalLog)
    private postalLogRepository: Repository<PostalLog>,
    @InjectRepository(PostReceiveMemberInfo)
    private postReceiveMemberInfoRepository: Repository<PostReceiveMemberInfo>,
    @InjectRepository(MemberPostbox)
    private memberPostboxRepository: Repository<MemberPostbox>,
    @Inject(DataSource) private dataSource: DataSource,
    private postalLogService: PostalLogService,
    private postboxSendService: PostboxSendService,
  ) {}
  private readonly logger = new Logger(PostboxService.name);

  async getConstants() {
    const postalType = await this.dataSource.getRepository(PostalType).find();
    const postalState = await this.dataSource.getRepository(PostalState).find();
    const appendType = await this.dataSource.getRepository(AppendType).find();
    const moneyType = await this.dataSource.getRepository(MoneyType).find();
    const postalEffectType = await this.dataSource
      .getRepository(PostalEffectType)
      .find();
    const postalSendType = await this.dataSource
      .getRepository(PostalSendType)
      .find();
    const postalLogType = await this.dataSource
      .getRepository(PostalLogType)
      .find();
    const logActionType = await this.dataSource
      .getRepository(LogActionType)
      .find();
    const itemType = await this.dataSource.getRepository(ItemType).find({
      where: {
        type: Not(ITEM_TYPE.NFT_COSTUME),
      },
    });
    const categoryType = await this.dataSource
      .getRepository(CategoryType)
      .createQueryBuilder('c')
      .select(['c.type as type', 'name.kor as name'])
      .innerJoin('c.LocalizationName', 'name')
      .getRawMany();

    return {
      postalType,
      postalState,
      appendType,
      moneyType,
      postalEffectType,
      postalSendType,
      postalLogType,
      logActionType,
      itemType,
      categoryType,
    };
  }

  async getPostboxes(data: GetTableDto) {
    const page = data?.page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    const searchType = data.searchType;
    const searchValue = data.searchValue;

    try {
      const postboxes = await this.postboxRepository
        .createQueryBuilder('p')
        .select([
          `
        p.id as id,
        p.subject as subject,
        p.postalType as postalType,
        postalType.name as postalTypeName,
        p.postalSendType as postalSendType,
        postalSendType.name as postalSendTypeName,
        p.postalState as postalState,
        postalState.name as postalStatename,
        p.sendedAt as sendedAt,
        p.createdAt as createdAt`,
        ])
        .innerJoin('p.PostalType', 'postalType')
        .innerJoin('p.PostalSendType', 'postalSendType')
        .innerJoin('p.PostalState', 'postalState')
        .orderBy('p.createdAt', 'DESC')
        .offset(offset)
        .limit(limit);

      const postboxesCount = await this.postboxRepository
        .createQueryBuilder('p')
        .select([
          `
        p.id as id,
        p.subject as subject,
        p.postalType as postalType,
        postalType.name as postalTypeName,
        p.postalSendType as postalSendType,
        postalSendType.name as postalSendTypeName,
        p.postalState as postalState,
        postalState.name as postalStatename,
        p.sendedAt as sendedAt,
        p.createdAt as createdAt`,
        ])
        .innerJoin('p.PostalType', 'postalType')
        .innerJoin('p.PostalSendType', 'postalSendType')
        .innerJoin('p.PostalState', 'postalState')
        .orderBy('p.createdAt', 'DESC');

      // 검색
      let searchValueArr = null;
      let startedAt = null;
      let endedAt = new Date();

      switch (searchType) {
        case SEARCH_TYPE.TOTAL:
          postboxes.orWhere('p.subject like :subject', {
            subject: `%${searchValue}%`,
          });
          postboxes.orWhere('p.summary like :summary', {
            summary: `%${searchValue}%`,
          });
          postboxes.orWhere('p.content like :content', {
            content: `%${searchValue}%`,
          });

          postboxesCount.orWhere('p.subject like :subject', {
            subject: `%${searchValue}%`,
          });
          postboxesCount.orWhere('p.summary like :summary', {
            summary: `%${searchValue}%`,
          });
          postboxesCount.orWhere('p.content like :content', {
            content: `%${searchValue}%`,
          });
          break;
        case SEARCH_TYPE.CREATED_AT:
          searchValueArr = String(searchValue).split('|');

          startedAt = new Date(StartedUnixTimestamp(Number(searchValueArr[0])));
          endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

          postboxes.where('p.createdAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          postboxes.andWhere('p.createdAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });

          postboxesCount.where('p.createdAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          postboxesCount.andWhere('p.createdAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });

          break;
        case SEARCH_TYPE.SENDED_AT:
          searchValueArr = String(searchValue).split('|');

          startedAt = new Date(StartedUnixTimestamp(Number(searchValueArr[0])));
          endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

          postboxes.where('p.sendedAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          postboxes.andWhere('p.sendedAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });

          postboxesCount.where('p.sendedAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          postboxesCount.andWhere('p.sendedAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          break;
        case SEARCH_TYPE.POSTAL_TYPE:
          postboxes.orWhere('p.postalType = :postalType', {
            postalType: Number(searchValue),
          });
          postboxesCount.orWhere('p.postalType = :postalType', {
            postalType: Number(searchValue),
          });
          break;

        case SEARCH_TYPE.POSTAL_STATE:
          postboxes.orWhere('p.postalState = :postalState', {
            postalState: Number(searchValue),
          });
          postboxesCount.orWhere('p.postalState = :postalState', {
            postalState: Number(searchValue),
          });
          break;

        default:
          break;
      }

      const rows = await postboxes.getRawMany();
      const count = await postboxesCount.getCount();
      return { rows, count };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('db 실패');
    }
  }

  async getPostbox(postboxId: number) {
    const postbox = await this.postboxRepository
      .createQueryBuilder('p')
      .select([
        'p.id as postboxId',
        'p.postalType as postalType',
        'postalType.name as postalTypeName',
        'p.postalSendType as postalSendType',
        'postalSendType.name as postalSendTypeName',
        'p.postalState as postalState',
        'postalState.name as postalStateName',
        'p.subject as subject',
        'p.summary as summary',
        'p.content as content',
        'p.period as period',
        'admin.name as adminName',
        'p.createdAt as createdAt',
        'p.sendedAt as sendedAt',
      ])
      .innerJoin('p.PostalType', 'postalType')
      .innerJoin('p.PostalSendType', 'postalSendType')
      .innerJoin('p.PostalState', 'postalState')
      .innerJoin('p.Admin', 'admin')
      .where('p.id = :postboxId', { postboxId })
      .getRawOne();

    // 썸네일 이름도 조회
    const postboxAppend = await this.postboxAppendRepository
      .createQueryBuilder('a')
      .select([
        'a.id as id',
        'a.appendType as appendType',
        'appendType.name as appendTypeName',
        'a.appendValue as appendValue',
        'a.count as count',
        'a.orderNum as orderNum',
      ])
      .innerJoin('a.Postbox', 'postbox')
      .innerJoin('a.AppendType', 'appendType')
      .where('a.postboxId = :postboxId', { postboxId })
      .getRawOne();

    if (postboxAppend) {
      if (postboxAppend.appendType === APPEND_TYPE.ITEM) {
        const item = await this.dataSource
          .getRepository(Item)
          .createQueryBuilder('i')
          .select([
            'i.id as itemId',
            'name.kor as name',
            'i.thumbnail as thumbnail',
          ])
          .innerJoin('i.LocalizationName', 'name')
          .where('i.id = :itemId', { itemId: postboxAppend.appendValue })
          .getRawOne();

        postboxAppend.thumbnail = item.thumbnail;
        postboxAppend.name = item.name;
      } else if (postboxAppend.appendType === APPEND_TYPE.MONEY) {
      }
    }

    if (postboxAppend) {
      postbox.postboxAppend = postboxAppend;
    }

    // 수신자가 있으면 수신자도 조회
    const postboxReceiveMembers = await this.postReceiveMemberInfoRepository
      .createQueryBuilder('m')
      .select([
        'member.id as memberId',
        'member.memberCode as memberCode',
        'member.nickname as nickname',
      ])
      .innerJoin('m.Member', 'member')
      .where('m.postboxId = :postboxId', { postboxId })
      .getRawMany();

    if (postboxReceiveMembers.length > 0) {
      postbox.postboxReceiveMembers = postboxReceiveMembers;
    }

    return { postbox: postbox };
  }

  // 전체 우편 발송
  async fullMailing(adminId: number, data: SendFullMailingDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (data.appendItems && data.appendItems.length > 0) {
        for (const item of data.appendItems) {
          const newPost = new Postbox();
          newPost.subject = data.subject;
          newPost.postalType = data.postalType;
          newPost.sendedAt = new Date(data.sendedAt);
          newPost.period = data.period;
          newPost.summary = data.summary;
          newPost.content = data.content;
          newPost.postalSendType = POSTAL_SEND_TYPE.ALL_SEND;
          newPost.adminId = adminId;

          await queryRunner.manager.getRepository(Postbox).save(newPost);

          const appendItem = new PostboxAppend();
          appendItem.postboxId = newPost.id;
          appendItem.appendType = item.appendType;
          appendItem.appendValue = item.appendValue;
          appendItem.count = item.count;
          appendItem.orderNum = item.orderNum;

          await queryRunner.manager
            .getRepository(PostboxAppend)
            .save(appendItem);
          await this.postalLogService.createLog(
            queryRunner,
            newPost.id,
            adminId,
          );
        }
      } else {
        const newPost = new Postbox();
        newPost.subject = data.subject;
        newPost.postalType = data.postalType;
        newPost.sendedAt = new Date(data.sendedAt);
        newPost.period = data.period;
        newPost.summary = data.summary;
        newPost.content = data.content;
        newPost.postalSendType = POSTAL_SEND_TYPE.ALL_SEND;
        newPost.adminId = adminId;

        await queryRunner.manager.getRepository(Postbox).save(newPost);
        await this.postalLogService.createLog(queryRunner, newPost.id, adminId);
      }

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  // 개별 우편 발송
  async eachMailing(adminId: number, data: SendEachMailingDto) {
    if (data.memberIds.length <= 0) {
      throw new BadGatewayException('수신자가 없습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (data.appendItems && data.appendItems.length > 0) {
        for (const item of data.appendItems) {
          const newPost = new Postbox();
          newPost.subject = data.subject;
          newPost.postalType = data.postalType;
          newPost.postalState = POSTAL_STATE.SCHEDULED;
          newPost.sendedAt = new Date(data.sendedAt);
          newPost.period = data.period;
          newPost.summary = data.summary;
          newPost.content = data.content;
          newPost.postalSendType = POSTAL_SEND_TYPE.EACH_SEND;
          newPost.adminId = adminId;

          await queryRunner.manager.getRepository(Postbox).save(newPost);

          const appendItem = new PostboxAppend();
          appendItem.postboxId = newPost.id;
          appendItem.appendType = item.appendType;
          appendItem.appendValue = item.appendValue;
          appendItem.count = item.count;
          appendItem.orderNum = item.orderNum;

          await queryRunner.manager
            .getRepository(PostboxAppend)
            .save(appendItem);

          for (const memberId of data.memberIds) {
            const receiveMember = new PostReceiveMemberInfo();
            receiveMember.memberId = memberId;
            receiveMember.postboxId = newPost.id;

            await queryRunner.manager
              .getRepository(PostReceiveMemberInfo)
              .save(receiveMember);
          }

          await this.postalLogService.createLog(
            queryRunner,
            newPost.id,
            adminId,
          );
        }
      } else {
        const newPost = new Postbox();
        newPost.subject = data.subject;
        newPost.postalType = data.postalType;
        newPost.postalState = POSTAL_STATE.SCHEDULED;
        newPost.sendedAt = new Date(data.sendedAt);
        newPost.period = data.period;
        newPost.summary = data.summary;
        newPost.content = data.content;
        newPost.postalSendType = POSTAL_SEND_TYPE.EACH_SEND;
        newPost.adminId = adminId;

        await queryRunner.manager.getRepository(Postbox).save(newPost);

        for (const memberId of data.memberIds) {
          const receiveMember = new PostReceiveMemberInfo();
          receiveMember.memberId = memberId;
          receiveMember.postboxId = newPost.id;

          await queryRunner.manager
            .getRepository(PostReceiveMemberInfo)
            .save(receiveMember);
        }
        await this.postalLogService.createLog(queryRunner, newPost.id, adminId);
      }

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  // 우편 아이템 조회
  async getItems(data: GetItemDto) {
    const pageSize = 10; // 페이지 사이즈
    try {
      const datas = await this.dataSource
        .getRepository(Item)
        .createQueryBuilder('i')
        .select([
          'i.id as itemId',
          'i.itemType as itemType',
          'itemType.name as itemTypeName',
          'i.categoryType as categoryType',
          'categoryTypeName.kor as categoryTypeName',
          'name.kor as name',
          'i.thumbnail as thumbnail',
        ])
        .innerJoin('i.ItemType', 'itemType')
        .innerJoin('i.CategoryType', 'categoryType')
        .innerJoin('i.LocalizationName', 'name')
        .innerJoin('categoryType.LocalizationName', 'categoryTypeName')
        .where('i.itemType <> :type', { type: ITEM_TYPE.NFT_COSTUME })
        .orderBy('name.kor', 'ASC')
        .addOrderBy('i.id', 'ASC')
        .limit(pageSize + 1);

      const dataCount = await this.dataSource
        .getRepository(Item)
        .createQueryBuilder('i')
        .innerJoin('i.ItemType', 'itemType')
        .innerJoin('i.CategoryType', 'categoryType')
        .innerJoin('i.LocalizationName', 'name')
        .innerJoin('categoryType.LocalizationName', 'categoryTypeName')
        .where('i.itemType <> :type', { type: ITEM_TYPE.NFT_COSTUME });

      // 이름으로 검색
      if (data.searchType === SEARCH_TYPE.NAME) {
        datas.andWhere('name.kor like :name', {
          name: `%${data.searchValue}%`,
        });
        dataCount.andWhere('name.kor like :name', {
          name: `%${data.searchValue}%`,
        });
      } else if (data.searchType === SEARCH_TYPE.CATEGORY_TYPE) {
        if (!data.itemType) {
          throw new ForbiddenException('아이템타입이 없습니다.');
        }

        if (data.categoryType) {
          datas.andWhere('i.categoryType = :categoryType', {
            categoryType: +data.categoryType,
          });
          dataCount.andWhere('i.categoryType = :categoryType', {
            categoryType: data.categoryType,
          });
        }

        if (data.itemType) {
          datas.andWhere('i.itemType = :itemType', {
            itemType: +data.itemType,
          });
          dataCount.andWhere('i.itemType = :itemType', {
            itemType: +data.itemType,
          });
        }

        if (data.text) {
          const [begin, end] = this.getKoreanRange(data.text);
          datas.andWhere(
            'LEFT(name.kor, 1) >= :begin AND LEFT(name.kor, 1) <= :end',
            {
              begin,
              end,
            },
          );
          dataCount.andWhere(
            'LEFT(name.kor, 1) >= :begin AND LEFT(name.kor, 1) <= :end',
            {
              begin,
              end,
            },
          );
        }
      }

      if (data.lastItemName) {
        datas.andWhere('name.kor > :lastItemName', {
          lastItemName: data.lastItemName,
        });
      }

      const items = await datas.getRawMany();
      const count = await dataCount.getCount();

      const hasNextPage = items.length > pageSize;
      const rows = hasNextPage ? items.slice(0, -1) : items;

      return { rows, count, hasNextPage };
    } catch (error) {
      console.log(error);
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new ForbiddenException('DB Failed');
    }
  }

  async getMembers(type: number, value: string) {
    const m = await this.dataSource
      .getRepository(Member)
      .createQueryBuilder('m')
      .select([
        'm.memberId as memberId',
        'm.memberCode as memberCode',
        'm.nickname as nickname',
        'm.createdAt as createdAt',
      ]);

    switch (type) {
      case FRND_REQUEST_TYPE.MEMBER_CODE:
        m.where('m.memberCode like :memberCode', { memberCode: `%${value}%` });
        break;

      case FRND_REQUEST_TYPE.NICKNAME:
        m.where('m.nickname like :nickname', { nickname: `%${value}%` });
        break;
      default:
        throw new BadRequestException('잘못된 요청입니다.');
    }
    const member = await m.getRawMany();

    return member;
  }

  // 우편 발송 편집
  async updatePostbox(
    adminId: number,
    data: UpdteMailingDto,
    postboxId: number,
  ) {
    // 수정 가능 여부 확인
    const today = dayjs(); // 현재 시간을 가져옴

    const postbox = await this.postboxRepository
      .createQueryBuilder('p')
      .select([
        'p.id as postboxId',
        'p.postalSendType as postalSendType',
        'p.subject as subject',
        'p.sendedAt as sendedAt',
        'p.period as period',
        'p.summary as summary',
        'p.content as content',
      ])
      .innerJoin('p.PostalType', 'postalType')
      .where('p.id = :postboxId', { postboxId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('p.sendedAt >= now()').orWhere('p.postalState = :value', {
            value: POSTAL_STATE.PENDDING,
          });
        }),
      )
      .getRawOne();

    if (data.sendedAt && dayjs(data.sendedAt) <= today) {
      throw new BadRequestException(
        '발송시간은 현재시간보다 작을 수 없습니다.',
      );
    }

    if (!postbox) {
      throw new BadRequestException('수정 불가');
    }

    const newPost = new Postbox();
    newPost.id = data.postboxId;
    if (data.subject) newPost.subject = data.subject;
    if (data.postalType) newPost.postalType = data.postalType;
    if (data.sendedAt) newPost.sendedAt = new Date(data.sendedAt);
    if (data.period) newPost.period = data.period;
    if (data.summary) newPost.summary = data.summary;
    if (data.content) newPost.content = data.content;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (data.appendItems) {
        for (const item of data.appendItems) {
          // 신규 아이템 추가
          if (item.count && item.count <= 0) {
            throw new ForbiddenException('아이템 수량은 0 보다 커야 합니다.');
          }
          if (item.actionType === LOG_ACTION_TYPE.CREATE) {
            const newItem = new PostboxAppend();
            newItem.postboxId = postboxId;
            newItem.appendType = item.appendType;
            newItem.appendValue = item.appendValue;
            newItem.count = item.count;
            newItem.orderNum = item.orderNum;

            await queryRunner.manager
              .getRepository(PostboxAppend)
              .save(newItem);
          }
          // 아이템 수정
          else if (item.actionType === LOG_ACTION_TYPE.UPDATE) {
            const newItem = new PostboxAppend();
            newItem.id = item.id;
            newItem.postboxId = postboxId;
            if (item.appendType) newItem.appendType = item.appendType;
            if (item.appendValue) newItem.appendValue = item.appendValue;
            if (item.count) newItem.count = item.count;
            if (item.orderNum) newItem.orderNum = item.orderNum;

            await queryRunner.manager
              .getRepository(PostboxAppend)
              .save(newItem);
          }
          // 아이템 삭제
          else if (item.actionType === LOG_ACTION_TYPE.DELETE) {
            await queryRunner.manager
              .getRepository(PostboxAppend)
              .delete({ id: item.id });
          }
        }
      }

      if (data.memberIds && data.memberIds.length > 0) {
        for (const item of data.memberIds) {
          // 신규 수신자 추가
          if (
            item.actionType === LOG_ACTION_TYPE.CREATE ||
            item.actionType === LOG_ACTION_TYPE.UPDATE
          ) {
            const newMember = new PostReceiveMemberInfo();
            newMember.postboxId = postboxId;
            newMember.memberId = item.memberId;

            await queryRunner.manager
              .getRepository(PostReceiveMemberInfo)
              .save(newMember);
          }
          // 수신자 삭제
          else if (item.actionType === LOG_ACTION_TYPE.DELETE) {
            await queryRunner.manager
              .getRepository(PostReceiveMemberInfo)
              .delete({ memberId: item.memberId, postboxId: postboxId });
          }
        }
      }

      await queryRunner.manager.getRepository(Postbox).save(newPost);
      const changeData = { ...data };
      await this.postalLogService.updateLog(
        queryRunner,
        postboxId,
        adminId,
        postbox,
        changeData,
      );

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  // 우편 삭제
  async deletePostbox(adminId: number, postboxId: number, page: number) {
    const postbox = await this.postboxRepository.findOne({
      where: {
        id: postboxId,
        postalState: Not(POSTAL_STATE.COMPLETE),
      },
    });

    if (!postbox) {
      throw new BadRequestException('삭제 할 수 없습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager
        .getRepository(Postbox)
        .delete({ id: postboxId });
      await queryRunner.commitTransaction();
      await this.postboxSendService.cancelMail(postboxId);
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(error);
    } finally {
      await queryRunner.release();
    }
  }

  // 우편 보류 하기
  async pendingPostbox(adminId: number, postboxId: number) {
    const postbox = await this.postboxRepository.findOne({
      select: ['postalState'],
      where: {
        id: postboxId,
        postalState: POSTAL_STATE.SCHEDULED,
      },
    });

    if (!postbox) {
      throw new BadRequestException('보류 할 수 없습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(Postbox).update(
        {
          id: postboxId,
        },
        { postalState: POSTAL_STATE.PENDDING },
      );
      const changeData = { postalState: POSTAL_STATE.PENDDING };
      await this.postalLogService.updateLog(
        queryRunner,
        postboxId,
        adminId,
        postbox,
        changeData,
      );

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(error);
    } finally {
      await queryRunner.release();
    }
  }

  // 우편 보류 해제 하기
  async releasePendingPostbox(adminId: number, postboxId: number) {
    const postbox = await this.postboxRepository.findOne({
      select: ['postalState'],
      where: {
        id: postboxId,
        postalState: POSTAL_STATE.PENDDING,
      },
    });

    if (!postbox) {
      throw new BadRequestException('보류 할 수 없습니다.');
    }

    const now = new Date();
    const sendedAt = new Date(postbox.sendedAt);
    if (sendedAt < now) {
      throw new ForbiddenException('발송 시간이 이미 지났습니다');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(Postbox).update(
        {
          id: postboxId,
        },
        { postalState: POSTAL_STATE.SCHEDULED },
      );

      const changeData = { postalState: POSTAL_STATE.SCHEDULED };
      await this.postalLogService.updateLog(
        queryRunner,
        postboxId,
        adminId,
        postbox,
        changeData,
      );

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(error);
    } finally {
      await queryRunner.release();
    }
  }

  // 우편 발송 로그 보기
  async getSendLogs(data: GetTableDto) {
    const page = data?.page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    const searchType = data.searchType;
    const searchValue = data.searchValue;

    try {
      const postboxes = await this.postboxRepository
        .createQueryBuilder('p')
        .select([
          `
        p.id as id,
        p.postalSendType as postalSendType,
        postalSendType.name as postalSendTypeName,
        p.postalType as postalType,
        postalType.name as postalTypeName,
        p.subject as subject,
        p.sendedAt as sendedAt
        `,
        ])
        .innerJoin('p.PostalType', 'postalType')
        .innerJoin('p.PostalSendType', 'postalSendType')
        .orderBy('p.createdAt', 'DESC')
        .offset(offset)
        .limit(limit);

      const postboxesCount = await this.postboxRepository
        .createQueryBuilder('p')
        .select([
          `
        p.id as id,
        p.postalSendType as postalSendType,
        postalSendType.name as postalSendTypeName,
        p.postalType as postalType,
        postalType.name as postalTypeName,
        p.subject as subject,
        p.sendedAt as sendedAt
        `,
        ])
        .innerJoin('p.PostalType', 'postalType')
        .innerJoin('p.PostalSendType', 'postalSendType');

      // 검색
      let searchValueArr = null;
      let startedAt = null;
      let endedAt = new Date();

      switch (searchType) {
        case SEARCH_TYPE.TOTAL:
          postboxes.orWhere('p.subject like :subject', {
            subject: `%${searchValue}%`,
          });
          postboxes.orWhere('p.summary like :summary', {
            summary: `%${searchValue}%`,
          });
          postboxes.orWhere('p.content like :content', {
            content: `%${searchValue}%`,
          });

          postboxesCount.orWhere('p.subject like :subject', {
            subject: `%${searchValue}%`,
          });
          postboxesCount.orWhere('p.summary like :summary', {
            summary: `%${searchValue}%`,
          });
          postboxesCount.orWhere('p.content like :content', {
            content: `%${searchValue}%`,
          });
          break;
        case SEARCH_TYPE.CREATED_AT:
          searchValueArr = String(searchValue).split('|');

          startedAt = new Date(StartedUnixTimestamp(Number(searchValueArr[0])));
          endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

          postboxes.where('p.createdAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          postboxes.andWhere('p.createdAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });

          postboxesCount.where('p.createdAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          postboxesCount.andWhere('p.createdAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });

          break;
        case SEARCH_TYPE.SENDED_AT:
          searchValueArr = String(searchValue).split('|');

          startedAt = new Date(StartedUnixTimestamp(Number(searchValueArr[0])));
          endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

          postboxes.where('p.sendedAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          postboxes.andWhere('p.sendedAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });

          postboxesCount.where('p.sendedAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          postboxesCount.andWhere('p.sendedAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          break;
        case SEARCH_TYPE.POSTAL_TYPE:
          postboxes.orWhere('p.postalType = :postalType', {
            postalType: Number(searchValue),
          });
          postboxesCount.orWhere('p.postalType = :postalType', {
            postalType: Number(searchValue),
          });
          break;
        case SEARCH_TYPE.POSTAL_SEND_TYPE:
          postboxes.orWhere('p.postalSendType = :postalSendType', {
            postalSendType: Number(searchValue),
          });
          postboxesCount.orWhere('p.postalSendType = :postalSendType', {
            postalSendType: Number(searchValue),
          });
          break;

        default:
          break;
      }

      const rows = await postboxes.getRawMany();
      const count = await postboxesCount.getCount();
      return { rows, count };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('db 실패');
    }
  }

  async getReceiveLogs(data: GetTableDto) {
    const page = data?.page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    const searchType = data.searchType;
    const searchValue = data.searchValue;

    try {
      const memberPostboxes = await this.memberPostboxRepository
        .createQueryBuilder('m')
        .select([
          `
        m.id as id,
        member.memberCode as memberCode,
        member.nickname as nickname,
        m.postboxId as postboxId,
        m.createdAt as createdAt,
        m.receivedAt as receivedAt
        `,
        ])
        .leftJoin('m.Member', 'member')
        .orderBy('m.createdAt', 'DESC')
        .offset(offset)
        .limit(limit);

      const memberPostboxesCount = await this.memberPostboxRepository
        .createQueryBuilder('m')
        .select([
          `
        m.id as id,
        member.memberCode as memberCode,
        member.nickname as nickname,
        m.postboxId as postboxId,
        m.createdAt as createdAt,
        m.receivedAt as receivedAt
        `,
        ])
        .leftJoin('m.Member', 'member');

      // 검색
      let searchValueArr = null;
      let startedAt = null;
      let endedAt = new Date();

      switch (searchType) {
        case SEARCH_TYPE.POSTBOX_ID:
          memberPostboxes.orWhere('m.postboxId = :postboxId', {
            postboxId: Number(searchValue),
          });
          memberPostboxesCount.orWhere('m.postboxId = :postboxId', {
            postboxId: Number(searchValue),
          });
          break;
        case SEARCH_TYPE.MEMBER_CODE:
          memberPostboxes.orWhere('member.memberCode like :memberCode', {
            memberCode: `%${searchValue}%`,
          });
          memberPostboxesCount.orWhere('member.memberCode like :memberCode', {
            memberCode: `%${searchValue}%`,
          });
          break;
        case SEARCH_TYPE.NICKNAME:
          memberPostboxes.orWhere('member.nickname like :nickname', {
            nickname: `%${searchValue}%`,
          });
          memberPostboxesCount.orWhere('member.nickname like :nickname', {
            nickname: `%${searchValue}%`,
          });
          break;
        case SEARCH_TYPE.CREATED_AT:
          searchValueArr = String(searchValue).split('|');

          startedAt = new Date(StartedUnixTimestamp(Number(searchValueArr[0])));
          endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

          memberPostboxes.where('m.createdAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          memberPostboxes.andWhere('m.createdAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });

          memberPostboxesCount.where('m.createdAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          memberPostboxesCount.andWhere('m.createdAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });

          break;
        case SEARCH_TYPE.RECEIVED_AT:
          searchValueArr = String(searchValue).split('|');

          startedAt = new Date(StartedUnixTimestamp(Number(searchValueArr[0])));
          endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

          memberPostboxes.where('m.receivedAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          memberPostboxes.andWhere('m.receivedAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });

          memberPostboxesCount.where('m.receivedAt >= :startedAt', {
            startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          memberPostboxesCount.andWhere('m.receivedAt <= :endedAt', {
            endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
          });
          break;

        default:
          break;
      }

      const rows = await memberPostboxes.getRawMany();

      for (const m of rows) {
        const item = await this.postboxAppendRepository
          .createQueryBuilder('p')
          .select([
            `
            p.id as id,
            p.appendType as appendType,
            appendType.name as appendTypeName,
            p.appendValue as appendValue,
            p.count as count,
            p.orderNum as orderNum
          `,
          ])
          .addSelect(
            `CASE 
            WHEN p.appendType = ${APPEND_TYPE.ITEM} 
            THEN i.thumbnail
            ELSE NULL
            END
            `,
            `thumbnail`,
          )
          .addSelect(
            `CASE 
            WHEN p.appendType = ${APPEND_TYPE.ITEM} 
            THEN itemName.kor
            ELSE NULL
            END
            `,
            `name`,
          )
          .innerJoin('p.AppendType', 'appendType')
          .leftJoin(
            'Item',
            'i',
            `p.appendType = ${APPEND_TYPE.ITEM} and p.appendValue = i.id`,
          )
          .innerJoin('i.LocalizationName', 'itemName')
          .where('p.postboxId = :postboxId', { postboxId: m.postboxId })
          .orderBy('p.orderNum', 'ASC')
          .getRawOne();

        m.item = item;
      }
      const count = await memberPostboxesCount.getCount();

      return { rows, count };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('db 실패');
    }
  }

  // 상세 로그 보기
  async getDetailLogs(data: GetLogDto, postboxId: number) {}

  private getKoreanRange(chosung: string): [string, string] {
    const CHOSUNG_BASE = 0xac00; // '가'의 유니코드
    const JUNGSEONG_COUNT = 21; // 중성의 개수
    const JONGSEONG_COUNT = 28; // 종성의 개수
    const CHOSUNG_COUNT = 19; // 초성의 개수

    const chosungMap = {
      ㄱ: 0,
      ㄲ: 1,
      ㄴ: 2,
      ㄷ: 3,
      ㄸ: 4,
      ㄹ: 5,
      ㅁ: 6,
      ㅂ: 7,
      ㅃ: 8,
      ㅅ: 9,
      ㅆ: 10,
      ㅇ: 11,
      ㅈ: 12,
      ㅉ: 13,
      ㅊ: 14,
      ㅋ: 15,
      ㅌ: 16,
      ㅍ: 17,
      ㅎ: 18,
    };

    if (!chosungMap.hasOwnProperty(chosung)) {
      throw new Error('Invalid chosung');
    }

    const chosungIndex = chosungMap[chosung];
    const start =
      CHOSUNG_BASE + chosungIndex * JUNGSEONG_COUNT * JONGSEONG_COUNT;

    let end;
    // 쌍자음을 갖는 초성일 경우, 쌍자음을 포함하도록 범위 계산
    if (
      chosungIndex === 0 ||
      chosungIndex === 3 ||
      chosungIndex === 7 ||
      chosungIndex === 9 ||
      chosungIndex === 12
    ) {
      end =
        CHOSUNG_BASE +
        (chosungIndex + 2) * JUNGSEONG_COUNT * JONGSEONG_COUNT -
        1;
    } else {
      // 쌍자음을 갖지 않는 초성일 경우, 현재 초성만 포함
      end =
        CHOSUNG_BASE +
        (chosungIndex + 1) * JUNGSEONG_COUNT * JONGSEONG_COUNT -
        1;
    }

    return [String.fromCharCode(start), String.fromCharCode(end)];
  }
}
