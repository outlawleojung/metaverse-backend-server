import { InquryAnswerService } from './../services/inqury.answer.service';
import { InquiryAnswerType } from '@libs/entity';
import { Injectable, Inject, Logger, ForbiddenException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateAnswerDto } from './dto/req/create.answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InquiryTemplate,
  InquiryType,
  Member,
  MemberInquiry,
  MemberInquiryAnswer,
  MemberInquiryManager,
  User,
} from '@libs/entity';
import { ADMIN_PAGE, SEARCH_TYPE, INQUIRY_ANSWER_TYPE } from '@libs/constants';
import { CreateInquiryTemplateDto } from './dto/req/create.inquiry.template.dto';
import { EndedUnixTimestamp, StartedUnixTimestamp } from '@libs/common';
import dayjs from 'dayjs';
import { UpdateAnswerDto } from './dto/req/update.answer.dto';
import { UpdateInquiryTemplateDto } from './dto/req/update.inquiry.template.dto';
import { GetInquiryListDto } from './dto/req/get.inquiry.list.dto';
import { GetTableDto } from '../common/dto/get.table.dto';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(MemberInquiryManager)
    private memberInquiryManagerRepository: Repository<MemberInquiryManager>,
    @InjectRepository(MemberInquiry)
    private memberInquiryRepository: Repository<MemberInquiry>,
    @InjectRepository(MemberInquiryAnswer)
    private memberInquiryAnswerRepository: Repository<MemberInquiryAnswer>,
    private inquryAnswerService: InquryAnswerService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(InquiryService.name);

  async getInquiries(data: GetInquiryListDto) {
    const page = data?.page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;

    const searchType = data.searchType;
    const searchValue = data.searchValue;
    const searchDateTime = data.searchDateTime;
    const searchInquiryType = data.searchInquiryType;
    const answerType = data.answerType;

    try {
      const inquiries = await this.memberInquiryManagerRepository
        .createQueryBuilder('m')
        .select([
          `m.id as id,
          m.answerType as answerType,
          memberInquiryGroup.inquiryType as inquiryType,
          inquiryType.name as inquiryTypeName,
          member.nickname as nickname,
          memberInquiryGroup.subject as subject,
          memberInquiry.content as content,
          member.memberCode as memberCode,
          memberInquiry.groupId as groupId,
          admin.name as adminName,
          memberInquiry.createdAt as createdAt
        `,
        ])
        .addSelect(
          `CASE
        WHEN answer.inquiryId IS NULL then NULL
        ELSE  
        answer.createdAt
      END`,
          'answerCreatedAt',
        )
        .innerJoin('m.MemberInquiry', 'memberInquiry')
        .innerJoin('m.InquiryAnswerType', 'inquiryAnswerType')
        .innerJoin('memberInquiry.MemberInquiryGroup', 'memberInquiryGroup')
        .leftJoin('m.MemberInquiryAnswer', 'answer')
        .innerJoin('memberInquiryGroup.Member', 'member')
        .innerJoin('memberInquiryGroup.InquiryType', 'inquiryType')
        .leftJoin('answer.Admin', 'admin')
        .orderBy('memberInquiry.createdAt', 'DESC')
        .groupBy('memberInquiry.groupId')
        .offset(offset)
        .limit(limit);

      const inquiriesCount = await this.memberInquiryManagerRepository
        .createQueryBuilder('m')
        .innerJoin('m.MemberInquiry', 'memberInquiry')
        .innerJoin('m.InquiryAnswerType', 'inquiryAnswerType')
        .innerJoin('memberInquiry.MemberInquiryGroup', 'memberInquiryGroup')
        .leftJoin('m.MemberInquiryAnswer', 'answer')
        .innerJoin('memberInquiryGroup.Member', 'member')
        .leftJoin('answer.Admin', 'admin')
        .innerJoin('memberInquiryGroup.InquiryType', 'inquiryType')
        .groupBy('memberInquiry.groupId');

      // 검색
      switch (searchType) {
        case SEARCH_TYPE.SUBJECT: // 제목 검색
          inquiries.andWhere('memberInquiryGroup.subject like :subject', {
            subject: `%${searchValue}%`,
          });
          inquiriesCount.andWhere('memberInquiryGroup.subject like :subject', {
            subject: `%${searchValue}%`,
          });
          break;
        case SEARCH_TYPE.MEMBER_CODE: // 회원 코드 검색
          inquiries.andWhere('member.memberCode = :memberCode', {
            memberCode: searchValue,
          });
          inquiriesCount.andWhere('member.memberCode = :memberCode', {
            memberCode: searchValue,
          });
          break;
        default:
          break;
      }

      // 기간 검색

      if (searchDateTime) {
        const searchValueArr = String(searchDateTime).split('|');
        const startedAt = new Date(
          StartedUnixTimestamp(Number(searchValueArr[0])),
        );
        const endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

        console.log(startedAt);
        console.log(endedAt);

        inquiries.andWhere('m.createdAt >= :startedAt', {
          startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
        });
        inquiries.andWhere('m.createdAt <= :endedAt', {
          endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
        });

        inquiriesCount.andWhere('m.createdAt >= :startedAt', {
          startedAt: dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss'),
        });
        inquiriesCount.andWhere('m.createdAt <= :endedAt', {
          endedAt: dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss'),
        });
      }

      // 문의 유형 검색
      if (searchInquiryType) {
        inquiries.andWhere(`memberInquiryGroup.inquiryType = :inquiryType`, {
          inquiryType: searchInquiryType,
        });
        inquiriesCount.andWhere(
          `memberInquiryGroup.inquiryType = :inquiryType`,
          {
            inquiryType: searchInquiryType,
          },
        );
      }

      // 답변 타입 검색
      if (answerType) {
        inquiries.andWhere(`m.answerType = :answerType`, {
          answerType: answerType,
        });
        inquiriesCount.andWhere(`m.answerType = :answerType`, {
          answerType: answerType,
        });
      }

      const rows = await inquiries.getRawMany();
      const count = await inquiriesCount.getRawMany();

      for (const i of rows) {
        const inq = await this.memberInquiryManagerRepository
          .createQueryBuilder('m')
          .select(['m.answerType'])
          .innerJoin('m.MemberInquiry', 'memberInquiry')
          .where('memberInquiry.groupId = :groupId', { groupId: i.groupId })
          .orderBy('memberInquiry.inquiryId', 'DESC')
          .getOne();

        i.answerType = inq.answerType;
      }

      // 답변 대기
      const waitingCount = await this.memberInquiryManagerRepository
        .createQueryBuilder('m')
        .select(['COUNT(id) as count'])
        .where('m.answerType = :answerType', {
          answerType: INQUIRY_ANSWER_TYPE.WAITING,
        })
        .getRawOne();

      // 예약 발송
      const reservCount = await this.memberInquiryManagerRepository
        .createQueryBuilder('m')
        .select(['COUNT(id) as count'])
        .where('m.answerType = :answerType', {
          answerType: INQUIRY_ANSWER_TYPE.RESERV,
        })
        .getRawOne();

      // 임시 저장 (보류)
      const holdCount = await this.memberInquiryManagerRepository
        .createQueryBuilder('m')
        .select(['COUNT(id) as count'])
        .where('m.answerType = :answerType', {
          answerType: INQUIRY_ANSWER_TYPE.HOLD,
        })
        .getRawOne();

      console.log(waitingCount);

      return {
        rows,
        count: count.length,
        answerInfo: {
          waitingCount: parseInt(waitingCount.count, 10),
          reservCount: parseInt(reservCount.count, 10),
          holdCount: parseInt(holdCount.count, 10),
        },
      };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('문의 목록 조회 실패');
    }
  }

  // 문의 내역 상세
  async getInquiry(adminId: number, groupId: number) {
    // 문의 내역 그룹에서 가장 최근 문의 조회
    const inquiry = await this.getLastInquiryInGroup(groupId);

    // 답변 조회
    const answer = await this.memberInquiryManagerRepository
      .createQueryBuilder('m')
      .select([
        'm.id as inquiryId',
        'm.answerType as answerType',
        'answerType.name as answerTypeName',
        'a.content as content',
        'a.adminId as adminId',
        'user.name as adminName',
        'a.createdAt as createdAt',
      ])
      .innerJoin('m.MemberInquiryAnswer', 'a')
      .innerJoin('m.InquiryAnswerType', 'answerType')
      .innerJoin('a.Admin', 'user')
      .where('a.inquiryId = :inquiryId', { inquiryId: inquiry.inquiryId })
      .getRawOne();

    // 회원 정보
    const member = await this.dataSource
      .getRepository(Member)
      .createQueryBuilder('m')
      .select([
        'm.memberCode as memberCode',
        'm.nickname as nickname',
        'm.createdAt as createdAt',
        'm.loginedAt as loginedAt',
        'm.officeGradeType as officeGradeType',
        'loc.kor as officeGradeTypename',
      ])
      .innerJoin('m.OfficeGradeType', 'ogt')
      .innerJoin('ogt.LocalizationName', 'loc')
      .where('m.memberId = :memberId', { memberId: inquiry.memberId })
      .getRawOne();

    return { inquiry, answer, member };
  }

  // 문의 내역 상세 ( 문의 조회 만 )
  async getInquiryParts(adminId: number, groupId: number) {
    // 문의 내역 그룹에서 가장 최근 문의 조회
    return await this.getLastInquiryInGroup(groupId);
  }

  // 문의 내역 상세 ( 로그 만 )
  async getInquiryLog(adminId: number, groupId: number) {
    const inquiries = await this.memberInquiryManagerRepository
      .createQueryBuilder('m')
      .select([
        `m.id as id,
      m.answerType as answerType,
      memberInquiryGroup.inquiryType as inquiryType,
      inquiryType.name as inquiryTypeName,
      member.nickname as nickname,
      memberInquiryGroup.subject as subject,
      memberInquiry.content as content,
      member.memberCode as memberCode,
      memberInquiry.groupId as groupId,
      admin.name as adminName,
      memberInquiry.images as images,
      memberInquiry.appVersion as appVersion,
      memberInquiry.deviceOS as deviceOS,
      memberInquiry.deviceModel as deviceModel,
      memberInquiry.createdAt as createdAt,
      m.reservationAt as reservationAt
    `,
      ])
      .addSelect(
        `CASE
    WHEN answer.inquiryId IS NULL then null
    ELSE  
    answer.createdAt
  END`,
        'answerCreatedAt',
      )
      .addSelect(
        `CASE
    WHEN answer.inquiryId IS NULL then null
    ELSE  
    answer.content
  END`,
        'answerContent',
      )
      .leftJoin('m.MemberInquiry', 'memberInquiry')
      .leftJoin('m.InquiryAnswerType', 'inquiryAnswerType')
      .leftJoin('memberInquiry.MemberInquiryGroup', 'memberInquiryGroup')
      .leftJoin('m.MemberInquiryAnswer', 'answer')
      .leftJoin('memberInquiryGroup.Member', 'member')
      .leftJoin('memberInquiryGroup.InquiryType', 'inquiryType')
      .leftJoin('answer.Admin', 'admin')
      .where('memberInquiry.groupId = :groupId', { groupId })
      .orderBy('memberInquiry.createdAt', 'ASC')
      .getRawMany();

    return inquiries;
  }

  // 문의 답변 하기
  async answer(adminId: number, data: CreateAnswerDto) {
    // 답변 여부 확인 하기
    const exAnswer = await this.memberInquiryAnswerRepository.findOne({
      where: {
        inquiryId: data.inquiryId,
      },
    });

    const inquiryManager = await this.memberInquiryManagerRepository.findOne({
      where: {
        id: data.inquiryId,
      },
    });

    if (
      exAnswer &&
      inquiryManager.answerType === INQUIRY_ANSWER_TYPE.COMPLETE
    ) {
      throw new ForbiddenException('이미 답변 했습니다.');
    }

    const inquiry = await this.dataSource
      .getRepository(MemberInquiry)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.MemberInquiryGroup', 'memberInquiryGroup')
      .where('m.inquiryId = :inquiryId', { inquiryId: data.inquiryId })
      .getOne();

    console.log(inquiry);

    if (!inquiry) {
      throw new ForbiddenException('잘못된 문의 정보 입니다.');
    }

    const answer = new MemberInquiryAnswer();
    answer.content = data.content;
    answer.inquiryId = data.inquiryId;
    answer.adminId = adminId;

    const newInquiryManager = new MemberInquiryManager();
    newInquiryManager.id = data.inquiryId;
    newInquiryManager.answerType = data.answerType;

    // 예약 설정 하기
    if (data.answerType === INQUIRY_ANSWER_TYPE.RESERV) {
      if (!data.reservationAt) {
        throw new ForbiddenException('예약 일시가 설정 되지 않았습니다.');
      }

      const now = new Date();
      if (now > new Date(data.reservationAt)) {
        throw new ForbiddenException('예약 일시는 현재 시각 보다 커야 합니다.');
      }

      newInquiryManager.reservationAt = new Date(data.reservationAt);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(MemberInquiryAnswer).save(answer);
      await queryRunner.manager
        .getRepository(MemberInquiryManager)
        .save(newInquiryManager);

      // 예약 발송 또는 임시 저장이 아닌 경우 메일 발송
      if (data.answerType === INQUIRY_ANSWER_TYPE.COMPLETE) {
        const answerInfo: any = {};

        answerInfo.email = inquiry.MemberInquiryGroup.email;
        answerInfo.answerContent = answer.content;
        answerInfo.subject = inquiry.MemberInquiryGroup.subject;
        answerInfo.createdAt = dayjs(inquiry.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        answerInfo.inquiryContent = inquiry.content;

        await this.inquryAnswerService.sendAnswerEmail(answerInfo);
      }

      await queryRunner.commitTransaction();

      // 스케줄링 등록
      if (data.answerType === INQUIRY_ANSWER_TYPE.RESERV) {
        console.log('답변 이메일 발송 스케줄러 등록');
        this.inquryAnswerService.createOrUpdateMail(newInquiryManager);
      }

      // 답변 조회
      const resultAnswer = await this.memberInquiryManagerRepository
        .createQueryBuilder('m')
        .select([
          'm.id as inquiryId',
          'm.answerType as answerType',
          'answerType.name as answerTypeName',
          'a.content as content',
          'a.adminId as adminId',
          'user.name as adminName',
          'a.createdAt as createdAt',
        ])
        .innerJoin('m.MemberInquiryAnswer', 'a')
        .innerJoin('m.InquiryAnswerType', 'answerType')
        .innerJoin('a.Admin', 'user')
        .where('a.inquiryId = :inquiryId', { inquiryId: inquiry.inquiryId })
        .getRawOne();

      const resultLog = await this.getInquiryLog(adminId, inquiry.groupId);

      console.log({ answer: resultAnswer, answerLog: resultLog });
      return { answer: resultAnswer, answerLog: resultLog };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 답변 수정
  async editInquiryAnswer(
    adminId: number,
    inquiryId: number,
    data: UpdateAnswerDto,
  ) {
    let currentAnswerType = 0;
    // 답변 여부 확인 하기
    const exAnswer = await this.memberInquiryAnswerRepository.findOne({
      where: {
        inquiryId: inquiryId,
      },
    });

    const inquiryManager = await this.memberInquiryManagerRepository.findOne({
      where: {
        id: inquiryId,
      },
    });

    currentAnswerType = inquiryManager.answerType;

    if (
      !exAnswer ||
      inquiryManager.answerType === INQUIRY_ANSWER_TYPE.WAITING
    ) {
      throw new ForbiddenException('아직 답변이 없습니다.');
    }

    // 답변 변경 내용 확인
    if (!data.answerType && !data.content && !data.reservationAt) {
      throw new ForbiddenException('변경 된 내용이 없습니다.');
    }

    // 기존 문의 정보
    const inquiry = await this.dataSource
      .getRepository(MemberInquiry)
      .createQueryBuilder('i')
      .select(['group.subject as subject', 'group.email as email'])
      .innerJoin('i.MemberInquiryGroup', 'group')
      .where('i.inquiryId = :inquiryId', { inquiryId: inquiryId })
      .getRawOne();

    const newInquiryManager = new MemberInquiryManager();
    newInquiryManager.id = inquiryId;

    // 답변 타입 변경 (실제 답변 타입과 비교 해서 다를 경우)
    if (data.answerType && inquiryManager.answerType !== data.answerType) {
      newInquiryManager.answerType = data.answerType;
      currentAnswerType = data.answerType;

      // 답변 타입을 예약으로 바뀐 경우
      if (data.answerType === INQUIRY_ANSWER_TYPE.RESERV) {
        if (!data.reservationAt) {
          throw new ForbiddenException('예약 시간을 설정 해주세요.');
        }

        // 예약 시간을 설정
        newInquiryManager.reservationAt = new Date(data.reservationAt);
      }
      // 답변 타입이 예약이 아닌 경우 ( 예약 시간 초기화 )
      else {
        newInquiryManager.reservationAt = null;
        await this.inquryAnswerService.cancelMail(inquiryId);
      }
    }
    // 기존 답변 타입과 같은 경우
    else {
      // 기존에 예약 이었는데 현재도 예약인 경우
      if (inquiryManager.answerType === INQUIRY_ANSWER_TYPE.RESERV) {
        // 예약 시간이 바뀐 경우
        if (data.reservationAt) {
          newInquiryManager.reservationAt = new Date(data.reservationAt);
        }
      }
    }

    const newAnswer = new MemberInquiryAnswer();
    newAnswer.inquiryId = inquiryId;
    newAnswer.adminId = adminId;

    // 답변 내용이 바뀐경우
    if (data.content) {
      newAnswer.content = data.content;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(MemberInquiryAnswer)
        .save(newAnswer);
      await queryRunner.manager
        .getRepository(MemberInquiryManager)
        .save(newInquiryManager);

      if (currentAnswerType === INQUIRY_ANSWER_TYPE.COMPLETE) {
        console.log(
          '#################### 이메일 발송 됨. ######################',
        );
        const answerInfo: any = {};

        answerInfo.email = inquiry.email;
        answerInfo.answerContent = newAnswer.content;
        answerInfo.subject = inquiry.subject;
        answerInfo.createdAt = dayjs(inquiry.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        answerInfo.inquiryContent = inquiry.content;

        await this.inquryAnswerService.sendAnswerEmail(answerInfo);
      }
      await queryRunner.commitTransaction();

      // 스케줄링 등록
      if (data.answerType === INQUIRY_ANSWER_TYPE.RESERV) {
        this.inquryAnswerService.createOrUpdateMail(newInquiryManager);
      }

      return 'success';
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 답변 템플릿 조회
  async getTemplate(adminId: number, data: GetTableDto) {
    console.log('템플릿 조회');
    console.log('data : ', data);

    const page = data?.page ?? 1;
    const limit = 10;
    const offset = 0 + (page - 1) * limit;

    try {
      const rows = await this.dataSource
        .getRepository(InquiryTemplate)
        .createQueryBuilder('t')
        .select([
          't.id as id',
          't.inquiryType as inquiryType',
          'inquiryType.name as inquiryTypeName',
          't.description as description',
          't.name as name',
          't.content as content',
          'user.id as adminId',
          'user.name as adminName',
          't.updatedAt as updatedAt',
        ])
        .innerJoin('t.Admin', 'user')
        .innerJoin('t.InquiryType', 'inquiryType')
        .orderBy('t.id', 'DESC')
        .limit(limit)
        .offset(offset)
        .getRawMany();

      const count = await this.dataSource
        .getRepository(InquiryTemplate)
        .createQueryBuilder('t')
        .getCount();

      return { rows, count };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('DB 에러');
    }
  }

  // 답변 템플릿 생성
  async createTemplate(adminId: number, data: CreateInquiryTemplateDto) {
    const template = new InquiryTemplate();
    template.inquiryType = data.inquiryType;
    template.description = data.description;
    template.name = data.name;
    template.content = data.content;
    template.adminId = adminId;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(InquiryTemplate).save(template);
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

  // 답변 템플릿 수정
  async updateTemplate(
    adminId: number,
    templateId: number,
    data: UpdateInquiryTemplateDto,
  ) {
    const temp = await this.dataSource.getRepository(InquiryTemplate).findOne({
      where: {
        id: templateId,
      },
    });

    if (!temp) {
      throw new ForbiddenException('존재 하지 않는 템플릿 입니다.');
    }

    const template = new InquiryTemplate();
    template.inquiryType = data.inquiryType;
    template.description = data.description;
    template.content = data.content;
    template.name = data.name;
    template.adminId = adminId;
    template.id = templateId;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(InquiryTemplate).save(template);
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

  // 답변 템플릿 삭제
  async deleteTemplate(adminId: number, templateId: number) {
    const temp = await this.dataSource.getRepository(InquiryTemplate).findOne({
      where: {
        id: templateId,
      },
    });

    if (!temp) {
      throw new ForbiddenException('존재 하지 않는 템플릿 입니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(InquiryTemplate)
        .delete({ id: templateId });
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

  // 문의 타입 상수 조회
  async getConstant() {
    const inquiryType = await this.dataSource.getRepository(InquiryType).find();
    const answerType = await this.dataSource
      .getRepository(InquiryAnswerType)
      .find();
    const template = await this.dataSource
      .getRepository(InquiryTemplate)
      .find();

    return { inquiryType, answerType, template };
  }

  // 문의 내역 그룹에서 가장 최근 문의 조회
  private async getLastInquiryInGroup(groupId: number) {
    // 마지막 문의 내역 조회

    const inquiry = await this.memberInquiryManagerRepository
      .createQueryBuilder('m')
      .select([
        'i.inquiryId as inquiryId',
        'group.subject as subject',
        'i.groupId as groupId',
        'i.content as content',
        'i.images as images',
        'i.appVersion as appVersion',
        'i.deviceModel as deviceModel',
        'i.deviceOS as deviceOS',
        'group.inquiryType as inquiryType',
        'group.memberId as memberId',
        'inquiryType.name as inquiryTypeName',
        'i.createdAt as createdAt',
      ])
      .leftJoin('m.MemberInquiry', 'i')
      .leftJoin('i.MemberInquiryGroup', 'group')
      .leftJoin('group.InquiryType', 'inquiryType')
      .where('groupId= :groupId', { groupId })
      .orderBy('inquiryId', 'DESC')
      .getRawMany();

    if (inquiry.length > 1) {
      inquiry[0].isFirst = 0;
    } else if (inquiry.length === 1) {
      inquiry[0].isFirst = 1;
    }

    return inquiry[0];
  }
}
