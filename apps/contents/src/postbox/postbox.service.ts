import { CommonService } from '@libs/common';
import {
  APPEND_TYPE,
  BOOLEAN,
  ERRORCODE,
  ERROR_MESSAGE,
  ITEM_TYPE,
} from '@libs/constants';
import {
  Item,
  Member,
  MemberAvatarPartsItemInven,
  MemberFurnitureItemInven,
  MemberPostbox,
} from '@libs/entity';
import { PostboxAppend } from '@libs/entity';
import { SystemPostboxAppend } from '@libs/entity';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { GetCommonDto } from '../dto/get.common.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class PostboxService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(PostboxAppend)
    private postboxAppendRepository: Repository<PostboxAppend>,
    @InjectRepository(SystemPostboxAppend)
    private systemPostboxAppendRepository: Repository<SystemPostboxAppend>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(MemberFurnitureItemInven)
    private memberFurnitureItemInvenRepository: Repository<MemberFurnitureItemInven>,
    @InjectRepository(MemberAvatarPartsItemInven)
    private memberAvaterPartsInvenRepository: Repository<MemberAvatarPartsItemInven>,
    @InjectRepository(MemberPostbox)
    private memberPostboxRepository: Repository<MemberPostbox>,
    private commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  private readonly logger = new Logger(PostboxService.name);

  async getPostboxes(data: GetCommonDto) {
    const memberId = data.memberId;

    const today = dayjs(); // 현재 시간을 가져옴

    try {
      const memberPostboxes = await this.memberPostboxRepository
        .createQueryBuilder('m')
        .select([
          'm.id as id',
          'm.postboxId as postboxId',
          'm.systemPostboxId as systemPostboxId',
          'postbox.subject as subject',
          'postbox.summary as summary',
          'postbox.content as content',
          'postalType.name as postalTypeName',
          'postbox.period as period',
          'postbox.createdAt as createdAt',
          'postbox.sendedAt as sendedAt',
        ])
        .leftJoin('m.Postbox', 'postbox')
        .leftJoin('m.SystemPostbox', 'systemPostbox')
        .innerJoin('postbox.PostalType', 'postalType')
        .where('m.memberId = :memberId', { memberId })
        .andWhere('m.isReceived = 0')
        .andWhere('m.receivedAt IS NULL')
        .andWhere(
          `DATE_ADD(postbox.sendedAt, INTERVAL postbox.period DAY) >= :today`,
          { today: today.format() },
        )
        .getRawMany();

      for (const post of memberPostboxes) {
        if (post.postboxId) {
          const item = await this.dataSource
            .getRepository(PostboxAppend)
            .findOne({
              select: ['appendType', 'appendValue', 'count', 'orderNum'],
              where: {
                postboxId: post.postboxId,
              },
            });
          post.item = item;
        } else if (post.systemPostboxId) {
          const item = await this.dataSource
            .getRepository(SystemPostboxAppend)
            .findOne({
              select: ['appendType', 'appendValue', 'count', 'orderNum'],
              where: {
                postboxId: post.postboxId,
              },
            });
          post.item = item;
        }

        const date = dayjs(post.createdAt);
        const futureDate = date.add(post.period, 'day'); // 생성된 날짜에 2일을 더합니다.
        const diffInSeconds = futureDate.diff(date, 'second'); // 두 날짜의 차이를 초 단위로 계산합니다.
        post.period = diffInSeconds;
        delete post.postboxId;
        delete post.systemPostboxId;
      }

      return {
        postboxes: memberPostboxes,
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {}
  }

  // 우편 개별 수령하기
  async receivePost(memberId: string, id: number) {
    const today = dayjs(); // 현재 시간을 가져옴

    const exMemberPost = await this.memberPostboxRepository
      .createQueryBuilder('m')
      .select([
        'm.id as id, m.postboxId as postboxId, m.systemPostboxId as systemPostboxId',
      ])
      .leftJoin('m.Postbox', 'postbox')
      .leftJoin('m.SystemPostbox', 'systemPostbox')
      .innerJoin('postbox.PostalType', 'postalType')
      .where('m.memberId = :memberId', { memberId })
      .andWhere('m.id = :id', { id })
      .andWhere('m.isReceived = 0')
      .andWhere('m.receivedAt IS NULL')
      .andWhere(
        `DATE_ADD(postbox.sendedAt, INTERVAL postbox.period DAY) >= :today`,
        { today: today.format() },
      )
      .getRawOne();

    // 우편이 없다.
    if (!exMemberPost) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_POST,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_POST),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let postAppend = {};
    if (exMemberPost.postboxId) {
      postAppend = await this.postboxAppendRepository.findOne({
        where: {
          postboxId: exMemberPost.postboxId,
        },
      });
    } else if (exMemberPost.systemPostboxId) {
      postAppend = await this.systemPostboxAppendRepository.findOne({
        where: {
          postboxId: exMemberPost.postboxId,
        },
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.receiveItem(queryRunner, memberId, postAppend);

      if (!result) {
        // 수령 불가
        return {
          error: ERRORCODE.NET_E_CANNOT_RECEIVED_POST,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_RECEIVED_POST),
        };
      }

      // 수령 완료
      const memberPost = new MemberPostbox();
      memberPost.postboxId = exMemberPost.postboxId;
      memberPost.memberId = memberId;
      memberPost.id = exMemberPost.id;
      memberPost.isReceived = BOOLEAN.TRUE;
      memberPost.receivedAt = new Date();

      console.log('@@@@@@@@@@@@@@@@@@@@ memberPost : ', memberPost);

      await queryRunner.manager.getRepository(MemberPostbox).save(memberPost);

      await queryRunner.commitTransaction();

      return {
        id: id,
        receivedItems: result,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
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

  // 우편 전체 수령하기
  async receiveAllPost(memberId: string) {
    const today = dayjs(); // 현재 시간을 가져옴

    const memberPosts = await this.memberPostboxRepository
      .createQueryBuilder('m')
      .select([
        'm.id as id, m.postboxId as postboxId, m.systemPostboxId as systemPostboxId',
      ])
      .leftJoin('m.Postbox', 'postbox')
      .leftJoin('m.SystemPostbox', 'systemPostbox')
      .innerJoin('postbox.PostalType', 'postalType')
      .where('m.memberId = :memberId', { memberId })
      .andWhere('m.isReceived = 0')
      .andWhere('m.receivedAt IS NULL')
      .andWhere(
        `DATE_ADD(postbox.sendedAt, INTERVAL postbox.period DAY) >= :today`,
        { today: today.format() },
      )
      .getRawMany();

    // 우편이 없다.
    if (!memberPosts) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_POST,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_POST),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(memberPosts);

    const postboxIds: number[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const receivedItems = [];
      for (const post of memberPosts) {
        let postAppend = {};
        if (post.postboxId) {
          postAppend = await this.postboxAppendRepository.findOne({
            where: {
              postboxId: post.postboxId,
            },
          });
        } else if (post.systemPostboxId) {
          postAppend = await this.systemPostboxAppendRepository.findOne({
            where: {
              postboxId: post.systemPostboxId,
            },
          });
        }

        console.log(postAppend);
        const result = await this.receiveItem(
          queryRunner,
          memberId,
          postAppend,
        );

        // 수령 완료
        if (result) {
          const id = post.id;

          await queryRunner.manager
            .createQueryBuilder()
            .update(MemberPostbox)
            .set({ isReceived: BOOLEAN.TRUE, receivedAt: new Date() })
            .where('id = :id AND memberId = :memberId', { id, memberId })
            .execute();

          postboxIds.push(post.id);

          if (postAppend) {
            receivedItems.push(...result);
          }
        }
      }
      await queryRunner.commitTransaction();

      // 수령한 아이템 목록 조회
      // const receivedItems = await this.getRecevedItemList(postboxIds);
      return {
        ids: postboxIds,
        receivedItems: receivedItems,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      console.log(err);
      this.logger.log(err);
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

  async receiveItem(
    queryRunner: QueryRunner,
    memberId: string,
    postboxAppend: any,
  ) {
    const item = postboxAppend;
    let result;

    if (!item) {
      return null;
    }

    // 아이템 일 경우
    if (item.appendType === APPEND_TYPE.ITEM) {
      //
      // 소유 가능 여부 확인
      if (await this.checkMemberItemCount(memberId, item.appendValue)) {
        const itemType = await this.getItemTypeFromItem(item.appendValue);

        if (itemType) {
          result = await this.addItem(
            queryRunner,
            memberId,
            itemType,
            item.appendValue,
            item.count,
          );
          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ result : ', result);
          if (!result) {
            return false;
          }
        } else {
          throw new HttpException({}, HttpStatus.FORBIDDEN);
        }
      } else {
        return false;
      }
    }
    // 재화 일 경우
    else if (item.appendType === APPEND_TYPE.MONEY) {
    }
    // 패키지 일 경우
    else if (item.appendType === APPEND_TYPE.PACKAGE) {
    }

    return result;
  }

  // 아이템 아이디로 아이템 타입 조회
  async getItemTypeFromItem(itemId: number): Promise<number | null> {
    const itemRepository = await this.itemRepository.findOne({
      where: { id: itemId },
    });

    return itemRepository.itemType;
  }

  // 아이템 갯수 체크 - 소유 가능 여부 확인
  async checkMemberItemCount(memberId: string, itemId) {
    const itemRepository = await this.itemRepository.findOne({
      where: { id: itemId },
    });

    if (itemRepository.itemType === ITEM_TYPE.INTERIOR) {
      const memberInteriorInven =
        await this.memberFurnitureItemInvenRepository.find({
          where: {
            memberId: memberId,
            itemId: itemId,
          },
        });

      if (
        memberInteriorInven &&
        itemRepository.capacity <= memberInteriorInven.length
      ) {
        return false;
      }
    } else if (itemRepository.itemType === ITEM_TYPE.COSTUME) {
      const memberAvatarPartsInven =
        await this.memberAvaterPartsInvenRepository.findOne({
          where: {
            memberId: memberId,
            itemId: itemId,
          },
        });

      console.log(memberAvatarPartsInven);

      if (memberAvatarPartsInven) {
        return false;
      }
    }

    return true;
  }

  // 아이템 추가
  async addItem(
    queryRunner: QueryRunner,
    memberId: string,
    itemType: number,
    itemId: number,
    count: number = 1,
  ) {
    const returnValues = [];

    try {
      if (itemType === ITEM_TYPE.INTERIOR) {
        for (let index = 0; index < count; index++) {
          const num = await this.commonService.GetFurnitureItemNum(
            queryRunner,
            memberId,
          );

          const memberInterior = new MemberFurnitureItemInven();
          memberInterior.memberId = memberId;
          memberInterior.itemId = itemId;
          memberInterior.num = num + 1;

          await queryRunner.manager
            .getRepository(MemberFurnitureItemInven)
            .save(memberInterior);
          const returnValue = {};
          returnValue['itemId'] = memberInterior.itemId;
          returnValue['num'] = memberInterior.num;
          returnValue['itemType'] = itemType;

          returnValues.push(returnValue);
        }

        return returnValues;
      } else if (itemType === ITEM_TYPE.COSTUME) {
        const memberAvatar = new MemberAvatarPartsItemInven();
        memberAvatar.memberId = memberId;
        memberAvatar.itemId = itemId;

        await queryRunner.manager
          .getRepository(MemberAvatarPartsItemInven)
          .save(memberAvatar);
        const returnValue = {};
        returnValue['itemId'] = memberAvatar.itemId;
        returnValue['itemType'] = itemType;
        returnValues.push(returnValue);

        return returnValues;
      } else if (itemType === ITEM_TYPE.GENERAL) {
        // TO DO
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // 수령한 아이템 목록 조회
  async getRecevedItemList(postboxIds: number[]) {
    const itemMap = new Map();
    for (const id of postboxIds) {
      const postAppends = await this.postboxAppendRepository.find({
        where: {
          postboxId: id,
        },
      });

      for (const item of postAppends) {
        if (item.appendType === APPEND_TYPE.ITEM) {
          if (itemMap.has(item.appendValue)) {
            const count: PostboxAppend = itemMap.get(item.appendValue);
            itemMap.delete(item.appendValue);

            const _item = item;
            _item.count += item.count;
            itemMap.set(item.appendValue, _item);
          } else {
            itemMap.set(item.appendValue, item);
          }
        } else if (item.appendType === APPEND_TYPE.MONEY) {
        } else if (item.appendType === APPEND_TYPE.PACKAGE) {
        }
      }
    }

    const recevedItems = [];
    for (const [key, value] of itemMap) {
      const item: any = {};
      item.appendType = value.appendType;
      item.appendValue = value.appendValue;
      item.count = value.count;

      recevedItems.push(item);
    }

    return recevedItems;
  }
}
