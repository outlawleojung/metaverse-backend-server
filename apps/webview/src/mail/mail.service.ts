import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

export type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  private readonly logger = new Logger(MailService.name);
  public sendEmail(options: EmailOptions, context: any) {
    this.mailerService
      .sendMail({
        to: options.to,
        from: process.env.MAIL_ID,
        subject: options.subject,
        template: options.html,
        context: context,
      })
      .then((success) => {
        this.logger.debug(success);
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }
}
