import { PostboxSendService } from './../services/postbox.send.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InquiryService } from '../inquiry/inquiry.service';

@Injectable()
export class TasksService {
  constructor(
    private inquiryService: InquiryService,
    private postboxSendService: PostboxSendService,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_SECONDS) // 매 30초마다 실행됨
  async handleCron() {
    const prod: boolean = process.env.NODE_ENV === 'production';
    if (prod) {
      this.logger.debug('Called when the current second is 30');
      const result = await this.postboxSendService.sendPostScheduler();
      return this.logger.debug(result);
    }
  }
}
