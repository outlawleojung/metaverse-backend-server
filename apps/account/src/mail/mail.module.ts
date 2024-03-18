import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://${process.env.MAIL_ID}:${process.env.MAIL_PASSWORD}@${process.env.MAIL_HOST}`,
      defaults: {
        from: `"admin" <${process.env.MAIL_ID}>`,
      },
      template: {
        dir: join(__dirname, '..', 'views'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
