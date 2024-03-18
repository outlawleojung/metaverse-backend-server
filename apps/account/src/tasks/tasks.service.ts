import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MemberService } from '../member/member.service';

@Injectable()
export class TasksService {
  constructor(private memberService: MemberService) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // 매일 자정에 호출
  async handleCron() {
    this.logger.debug('Called when the current day');

    // 탈퇴 처리
    const checkWithdrawal = await this.memberService.checkWithdrawal();

    // 오피스 구매 종료 처리
    const checkUpdateofficeGradeType = await this.memberService.checkUpdateOfficeGradeType();

    return this.logger.log({ checkWithdrawal, checkUpdateofficeGradeType });
  }
}
