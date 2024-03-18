import {
  MemberInquiry,
  MemberInquiryGroup,
  MemberInquiryAnswer,
  InquiryType,
  MemberInquiryManager,
} from '@libs/entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  Inject,
  ForbiddenException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CreateInquiryDto } from './dto/req/create.inquiry.dto';
import { AzureBlobService, CommonService } from '@libs/common';
import { INQUIRY_ANSWER_TYPE } from '@libs/constants';
import { DataSource, Repository } from 'typeorm';
import { MoreInquiryDto } from './dto/req/more.inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(
    private azureBlobService: AzureBlobService,
    @InjectRepository(MemberInquiry)
    private readonly inquiryRepository: Repository<MemberInquiry>,
    @InjectRepository(MemberInquiryManager)
    private memberInquiryManagerRepository: Repository<MemberInquiryManager>,
    @InjectRepository(MemberInquiryGroup)
    private readonly inquiryGroupRepository: Repository<MemberInquiryGroup>,
    @InjectRepository(MemberInquiryAnswer)
    private readonly inquiryAnswerRepository: Repository<MemberInquiryAnswer>,
    private readonly commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(InquiryService.name);

  // 문의 내역 목록 조회
  async getInquiries(memberId: string, _lastId: number) {
    const limit = 5;
    const lastId = _lastId | 0;

    const rows = await this.memberInquiryManagerRepository
      .createQueryBuilder('m')
      .select([
        'm.id as inquiryId',
        'memberInquiry.groupId as groupId',
        'memberInquiryGroup.subject as subject',
        'COUNT(memberInquiry.inquiryId) as inquiryCount',
        'memberInquiryGroup.inquiryType as inquiryType',
        'inquiryType.name as inquiryTypeName',
        'memberInquiry.createdAt as createdAt',
      ])
      .addSelect(
        `CASE
        WHEN memberInquiry.images IS NULL then 0
        ELSE 1
        END`,
        'isImages',
      )
      .innerJoin('m.MemberInquiry', 'memberInquiry')
      .innerJoin('m.InquiryAnswerType', 'inquiryAnswerType')
      .innerJoin('memberInquiry.MemberInquiryGroup', 'memberInquiryGroup')
      .innerJoin('memberInquiryGroup.Member', 'member')
      .innerJoin('memberInquiryGroup.InquiryType', 'inquiryType')
      .where('memberInquiryGroup.memberId= :memberId', { memberId })
      .orderBy('m.createdAt', 'DESC')
      .groupBy('memberInquiry.groupId')
      .limit(limit);

    if (lastId > 0) {
      rows.andWhere('m.id < :lastId', { lastId });
    }
    const myInquiries = await rows.getRawMany();

    for (const i of myInquiries) {
      const inq = await this.memberInquiryManagerRepository
        .createQueryBuilder('m')
        .select(['m.answerType'])
        .innerJoin('m.MemberInquiry', 'memberInquiry')
        .innerJoin('memberInquiry.MemberInquiryGroup', 'memberInquiryGroup')
        .where('memberInquiryGroup.memberId = :memberId', { memberId })
        .andWhere('memberInquiry.groupId = :groupId', { groupId: i.groupId })
        .orderBy('memberInquiry.inquiryId', 'DESC')
        .getOne();

      i.isAnswered = inq.answerType === INQUIRY_ANSWER_TYPE.COMPLETE ? 1 : 0;
    }

    const count = await this.inquiryRepository
      .createQueryBuilder('i')
      .select('i.groupId')
      .leftJoin('i.MemberInquiryGroup', 'memberInquiryGroup')
      .leftJoin('memberInquiryGroup.Member', 'member')
      .leftJoin('memberInquiryGroup.InquiryType', 'inquiryType')
      .where('memberInquiryGroup.memberId= :memberId', { memberId })
      .groupBy('i.groupId')
      .getRawMany();

    this.logger.debug({ myInquiries: myInquiries, count: count.length });

    return { myInquiries, count: count.length };
  }

  // 문의 내역 조회
  async getInquiry(memberId: string, groupId: number, _lastId: number) {
    const limit = 5;
    const lastId = _lastId | 0;
    // 가장 최초 문의

    const firstInquiry = await this.inquiryRepository.findOne({
      where: {
        groupId: groupId,
      },
      order: {
        inquiryId: 'ASC',
      },
    });

    const rows = await this.memberInquiryManagerRepository
      .createQueryBuilder('m')
      .select([
        'm.id as inquiryId',
        'memberInquiry.groupId as groupId',
        'memberInquiryGroup.subject as subject',
        'memberInquiryGroup.inquiryType as inquiryType',
        'inquiryType.name as inquiryTypeName',
        'memberInquiry.images as images',
        'memberInquiry.content as content',
        'memberInquiry.createdAt as createdAt',
      ])
      .addSelect(
        `CASE
      WHEN m.answerType <> ${INQUIRY_ANSWER_TYPE.HOLD} then memberInquiryAnswer.content
      ELSE null
      END`,
        'answerContent',
      )
      .addSelect(
        `CASE
      WHEN m.answerType <> ${INQUIRY_ANSWER_TYPE.HOLD} then memberInquiryAnswer.createdAt
      ELSE null
      END`,
        'answerCreatedAt',
      )
      .addSelect(
        `CASE
      WHEN memberInquiry.inquiryId = ${firstInquiry.inquiryId} then 1
      ELSE 0
      END`,
        'isFirst',
      )
      .addSelect(
        `CASE
      WHEN m.answerType = ${INQUIRY_ANSWER_TYPE.COMPLETE} then 1
      ELSE 0
      END`,
        'isAnswered',
      )
      .leftJoin('m.MemberInquiry', 'memberInquiry')
      .leftJoin('m.MemberInquiryAnswer', 'memberInquiryAnswer')
      .leftJoin('memberInquiry.MemberInquiryGroup', 'memberInquiryGroup')
      .leftJoin('memberInquiryGroup.Member', 'member')
      .leftJoin('memberInquiryGroup.InquiryType', 'inquiryType')
      .where('memberInquiryGroup.memberId= :memberId', { memberId })
      .andWhere('memberInquiry.groupId= :groupId', { groupId })
      .orderBy('memberInquiry.createdAt', 'DESC')
      .limit(limit);

    if (lastId) {
      rows.andWhere('m.id < :lastId', { lastId });
    }

    const myInquiries = await rows.getRawMany();

    const count = await this.memberInquiryManagerRepository
      .createQueryBuilder('m')
      .leftJoin('m.MemberInquiry', 'memberInquiry')
      .leftJoin('m.MemberInquiryAnswer', 'memberInquiryAnswer')
      .leftJoin('memberInquiry.MemberInquiryGroup', 'memberInquiryGroup')
      .leftJoin('memberInquiryGroup.Member', 'member')
      .leftJoin('memberInquiryGroup.InquiryType', 'inquiryType')
      .where('memberInquiryGroup.memberId= :memberId', { memberId })
      .andWhere('memberInquiry.groupId= :groupId', { groupId })
      .getCount();

    this.logger.debug({ myInquiries: myInquiries, count: count });

    return { myInquiries, count };
  }

  // 문의 하기
  async inquiry(
    files: Array<Express.Multer.File>,
    memberId: string,
    data: CreateInquiryDto,
  ) {
    if (files.length > 3) {
      throw new ForbiddenException('이미지 파일은 3개까지 유효 합니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const inquiryGroup = new MemberInquiryGroup();
      inquiryGroup.memberId = memberId;
      inquiryGroup.inquiryType = data.inquiryType;
      inquiryGroup.subject = data.subject;
      inquiryGroup.email = data.email;

      await queryRunner.manager
        .getRepository(MemberInquiryGroup)
        .save(inquiryGroup);

      const inquiryManager = new MemberInquiryManager();
      await queryRunner.manager
        .getRepository(MemberInquiryManager)
        .save(inquiryManager);

      const inquiry = new MemberInquiry();

      inquiry.content = data.content;
      inquiry.groupId = inquiryGroup.id;
      inquiry.inquiryId = inquiryManager.id;
      inquiry.appVersion = data.appVersion;
      inquiry.deviceModel = data.deviceModel;
      inquiry.deviceOS = data.deviceOS;

      await queryRunner.manager.getRepository(MemberInquiry).save(inquiry);

      // 이미지 파일 처리
      if (files.length > 0) {
        const imageArr = [];
        for (const image of files) {
          const imageName = this.commonService.getImageName(image.originalname);
          const path = `inquiry/${inquiry.inquiryId}/${imageName}`;

          await this.azureBlobService.upload(image, path);

          imageArr.push(imageName);
        }
        const patchInquiry = new MemberInquiry();
        patchInquiry.inquiryId = inquiry.inquiryId;
        patchInquiry.images = JSON.stringify(imageArr);
        await queryRunner.manager
          .getRepository(MemberInquiry)
          .save(patchInquiry);
      }

      await queryRunner.commitTransaction();

      return HttpStatus.OK;
    } catch (error) {
      this.logger.error({ error: error });
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB Error');
    } finally {
      await queryRunner.release();
    }
  }

  // 추가 문의 하기
  async moreInquiry(
    files: Array<Express.Multer.File>,
    memberId: string,
    data: MoreInquiryDto,
  ) {
    const inquiryGroup = await this.dataSource
      .getRepository(MemberInquiryGroup)
      .findOne({
        where: {
          id: data.groupId,
        },
      });

    if (inquiryGroup.memberId !== memberId) {
      throw new ForbiddenException('회원 정보가 일치 하지 않습니다.');
    }

    if (files.length > 3) {
      throw new ForbiddenException('이미지 파일은 3개까지 유효 합니다.');
    }

    // 가장 최근 문의에 답변이 있는지 확인
    const lastInquiry = await this.memberInquiryManagerRepository
      .createQueryBuilder('m')
      .select(['m.id as lastId'])
      .innerJoin('m.MemberInquiry', 'memberInquiry')
      .where('memberInquiry.groupId = :groupId', { groupId: data.groupId })
      .orderBy('m.id', 'DESC')
      .getRawOne();

    const answer = await this.dataSource
      .getRepository(MemberInquiryManager)
      .findOne({
        where: {
          id: lastInquiry.lastId,
        },
      });

    if (answer.answerType !== INQUIRY_ANSWER_TYPE.COMPLETE) {
      throw new ForbiddenException('아직 이전 문의에 답변이 없습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const inquiryManager = new MemberInquiryManager();
      await queryRunner.manager
        .getRepository(MemberInquiryManager)
        .save(inquiryManager);

      const inquiry = new MemberInquiry();
      inquiry.content = data.content;
      inquiry.groupId = data.groupId;
      inquiry.inquiryId = inquiryManager.id;
      inquiry.appVersion = data.appVersion;
      inquiry.deviceModel = data.deviceModel;
      inquiry.deviceOS = data.deviceOS;

      await queryRunner.manager.getRepository(MemberInquiry).save(inquiry);

      // 이미지 파일 처리
      if (files.length > 0) {
        const imageArr = [];
        for (const image of files) {
          const imageName = this.commonService.getImageName(image.originalname);
          const path = `inquiry/${inquiry.inquiryId}/${imageName}`;

          await this.azureBlobService.upload(image, path);

          imageArr.push(imageName);
        }
        const patchInquiry = new MemberInquiry();
        patchInquiry.inquiryId = inquiry.inquiryId;
        patchInquiry.images = JSON.stringify(imageArr);
        await queryRunner.manager
          .getRepository(MemberInquiry)
          .save(patchInquiry);
      }

      await queryRunner.commitTransaction();

      return HttpStatus.OK;
    } catch (error) {
      this.logger.error({ error: error });
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB Error');
    } finally {
      await queryRunner.release();
    }
  }

  // 문의 삭제
  async deleteInquiry(memberId: string, groupId: number) {
    // 문의 조회 하기
    const inquiry = await this.inquiryGroupRepository.findOne({
      where: {
        id: groupId,
        memberId: memberId,
      },
    });

    if (!inquiry) {
      throw new ForbiddenException('존재 하지 않는 문의 입니댜ㅏ.');
    }

    const inquiries = await this.inquiryRepository.find({
      where: {
        groupId: groupId,
      },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const inq of inquiries) {
        await queryRunner.manager
          .getRepository(MemberInquiryManager)
          .softDelete({ id: inq.inquiryId });
        await queryRunner.manager
          .getRepository(MemberInquiry)
          .softDelete({ inquiryId: inq.inquiryId });
        await queryRunner.manager
          .getRepository(MemberInquiryAnswer)
          .softDelete({ inquiryId: inq.inquiryId });
      }

      await queryRunner.manager
        .getRepository(MemberInquiryGroup)
        .softDelete({ id: groupId });

      await queryRunner.commitTransaction();

      return 'success';
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB 실패!!');
    } finally {
      await queryRunner.release();
    }
  }

  // 문의 타입 상수 조회
  async getConstant() {
    return await this.dataSource.getRepository(InquiryType).find();
  }
}
