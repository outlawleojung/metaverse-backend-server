import { POSTAL_SEND_TYPE, POSTAL_STATE } from '@libs/constants';
import {
  Member,
  MemberPostbox,
  PostReceiveMemberInfo,
  Postbox,
} from '@libs/entity';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import * as schedule from 'node-schedule';
import { DataSource, LessThanOrEqual, QueryRunner } from 'typeorm';

@Injectable()
export class PostboxSendService {
  constructor(@Inject(DataSource) private dataSource: DataSource) {}
  private jobs = {};

  async createOrUpdateMail(postbox: Postbox) {
    // 우편물 정보를 데이터베이스에 저장합니다.

    // 이전에 생성된 스케줄링 작업이 있다면 취소합니다.
    if (this.jobs[postbox.id]) {
      this.jobs[postbox.id].cancel();
    }

    // 새로운 스케줄링 작업을 생성합니다.
    this.jobs[postbox.id] = schedule.scheduleJob(postbox.sendedAt, async () => {
      // 여기에 우편물을 사용자의 데이터베이스에 삽입하는 코드를 작성합니다.
      await this.sendPost(postbox);
    });
  }

  async cancelMail(id: number) {
    if (this.jobs[id]) {
      this.jobs[id].cancel();
    }
  }

  private insertBatch = async (
    queryRunner: QueryRunner,
    mailObjects: object[],
  ) => {
    const mailRepository = queryRunner.manager.getRepository(MemberPostbox);
    await mailRepository
      .createQueryBuilder()
      .insert()
      .into(MemberPostbox)
      .values(mailObjects)
      .execute();
  };

  private createMailObjects = async (members: any, postboxId: number) => {
    const objects = [];
    for (const m of members) {
      const memberId = m.memberId;
      const member = await this.dataSource
        .getRepository(MemberPostbox)
        .createQueryBuilder('m')
        .select('MAX(m.id)', 'maxId')
        .where('m.memberId = :memberId', { memberId })
        .groupBy('m.memberId')
        .getRawOne();

      let nextNum;
      if (member) {
        nextNum = member.maxId ? member.maxId + 1 : 1;
      } else {
        nextNum = 1;
      }

      const obj: any = {};
      obj.memberId = memberId;
      obj.id = nextNum;
      obj.postboxId = postboxId;

      objects.push(obj);
    }
    return objects;
  };

  async sendPost(pb: Postbox) {
    // 아직 발송 되지 않은 우편 목록 조회
    const postbox = await this.dataSource.getRepository(Postbox).findOne({
      where: {
        id: pb.id,
        sendedAt: LessThanOrEqual(new Date()),
        isSended: 0,
        postalState: POSTAL_STATE.SCHEDULED,
      },
    });

    // 개별 발송 회원 목록 여부 조회
    const postReceiveMemberInfos = await this.dataSource
      .getRepository(PostReceiveMemberInfo)
      .find({
        where: {
          postboxId: postbox.id,
        },
      });

    if (
      postReceiveMemberInfos.length > 0 &&
      postbox.postalSendType === POSTAL_SEND_TYPE.EACH_SEND
    ) {
      // 개별 발송 하기
      return await this.sendMails(postReceiveMemberInfos, postbox.id);
    } else if (postbox.postalSendType === POSTAL_SEND_TYPE.ALL_SEND) {
      // 전체 발송 하기
      const members = await this.dataSource.getRepository(Member).find();
      return await this.sendMails(members, postbox.id);
    } else {
      await this.dataSource
        .getRepository(Postbox)
        .update(postbox.id, { postalState: POSTAL_STATE.PENDDING });
      throw new ForbiddenException('발송 타입 오류 입니다.');
    }
  }

  async sendPostScheduler() {
    // 아직 발송 되지 않은 우편 목록 조회
    const postboxes = await this.dataSource.getRepository(Postbox).find({
      where: {
        sendedAt: LessThanOrEqual(new Date()),
        isSended: 0,
        postalState: POSTAL_STATE.SCHEDULED,
      },
    });

    for (const postbox of postboxes) {
      // 개별 발송 회원 목록 여부 조회
      const postReceiveMemberInfos = await this.dataSource
        .getRepository(PostReceiveMemberInfo)
        .find({
          where: {
            postboxId: postbox.id,
          },
        });

      if (
        postReceiveMemberInfos.length > 0 &&
        postbox.postalSendType === POSTAL_SEND_TYPE.EACH_SEND
      ) {
        // 개별 발송 하기
        return await this.sendMails(postReceiveMemberInfos, postbox.id);
      } else if (postbox.postalSendType === POSTAL_SEND_TYPE.ALL_SEND) {
        // 전체 발송 하기
        const members = await this.dataSource.getRepository(Member).find();
        return await this.sendMails(members, postbox.id);
      } else {
        await this.dataSource
          .getRepository(Postbox)
          .update(postbox.id, { postalState: POSTAL_STATE.PENDDING });
        throw new ForbiddenException('발송 타입 오류 입니다.');
      }
    }

    return 'Empty Post';
  }

  // 실제 발송 하기 (데이터베이스 처리)
  private sendMails = async (members: any, postboxId: number) => {
    const mailObjects = await this.createMailObjects(members, postboxId);

    const postbox = new Postbox();
    postbox.id = postboxId;
    postbox.isSended = 1;
    postbox.postalState = POSTAL_STATE.COMPLETE;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      await this.insertBatch(queryRunner, mailObjects);
      await queryRunner.manager.getRepository(Postbox).save(postbox);
      await queryRunner.commitTransaction();
      console.log('우편 발송 완료');
      return `우편 발송 성공 : ${members.length}`;
    } catch (error) {
      console.error('Error while sending mails:', error);
      await queryRunner.rollbackTransaction();
      return `우편 발송 실패`;
    } finally {
      await queryRunner.release();
    }
  };
}
