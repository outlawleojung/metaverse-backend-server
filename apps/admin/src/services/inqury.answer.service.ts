import { EmailOptions, MailService } from './../mail/mail.service';
import { INQUIRY_ANSWER_TYPE } from '@libs/constants';
import { MemberInquiryManager } from '@libs/entity';
import { Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import * as schedule from 'node-schedule';
import { DataSource } from 'typeorm';

@Injectable()
export class InquryAnswerService {
  constructor(
    private mailService: MailService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private jobs = {};

  async createOrUpdateMail(answer: MemberInquiryManager) {
    // 우편물 정보를 데이터베이스에 저장합니다.

    // 이전에 생성된 스케줄링 작업이 있다면 취소합니다.
    if (this.jobs[answer.id]) {
      this.jobs[answer.id].cancel();
    }

    // 새로운 스케줄링 작업을 생성합니다.
    this.jobs[answer.id] = schedule.scheduleJob(
      answer.reservationAt,
      async () => {
        this.sendReservationAnswer(answer);
      },
    );
  }

  async cancelMail(id: number) {
    if (this.jobs[id]) {
      this.jobs[id].cancel();
    }
  }

  // 예약 발송 하기
  async sendReservationAnswer(answer: MemberInquiryManager) {
    const now = new Date();
    const reservList = await this.dataSource
      .getRepository(MemberInquiryManager)
      .createQueryBuilder('m')
      .select([
        `m.id as id`,
        `inquiryGroup.email as email`,
        `m.reservationAt as reservationAt`,
        `inquiry.content inquiryContent`,
        `inquiryAnswer.content answerContent`,
        `inquiryGroup.subject as subject`,
        `inquiry.createdAt as createdAt`,
      ])
      .innerJoin('m.MemberInquiry', 'inquiry')
      .innerJoin('inquiry.MemberInquiryGroup', 'inquiryGroup')
      .innerJoin('m.MemberInquiryAnswer', 'inquiryAnswer')
      .where('m.id = :id', { id: answer.id })
      .andWhere('m.answerType = :answerType', {
        answerType: INQUIRY_ANSWER_TYPE.RESERV,
      })
      .andWhere('m.reservationAt <= :now', {
        now: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .getRawMany();

    console.log(reservList);

    if (reservList.length > 0) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const r of reservList) {
          if (r.reservationAt < now) {
            const manager = new MemberInquiryManager();
            manager.id = r.id;
            manager.answerType = INQUIRY_ANSWER_TYPE.COMPLETE;
            await queryRunner.manager
              .getRepository(MemberInquiryManager)
              .save(manager);
            await queryRunner.commitTransaction();

            await this.sendAnswerEmail(r);
          }
        }

        return `Send Reservation Answer Count : ${reservList.length}`;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        return 'Error Reservation Answer';
      } finally {
        await queryRunner.release();
      }
    }

    return 'Empty Reservation Answer';
  }

  // 답변 메일 보내기
  async sendAnswerEmail(reservationInfo: any) {
    // 이메일 보내기
    console.log('############### 문의 답변 이메일 발송 ############# ');
    const emailOptions: EmailOptions = {
      to: reservationInfo.email,
      subject: '[a:rzmeta] 고객님의 문의에 대한 답변 입니다.',
      html: 'inquiryAnswer',
      text: '문의 답변 메일 입니다.',
    };

    const context = {
      answerContent: reservationInfo.answerContent,
      subject: reservationInfo.subject,
      createdAt: dayjs(reservationInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      inquiryContent: reservationInfo.inquiryContent,
    };

    console.log(reservationInfo);
    await this.mailService.sendEmail(emailOptions, context);
  }
}
