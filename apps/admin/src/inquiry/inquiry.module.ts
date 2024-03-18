import { InquryAnswerService } from './../services/inqury.answer.service';
import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  InquiryType,
  Member,
  MemberAccount,
  MemberInquiry,
  MemberInquiryAnswer,
  MemberInquiryGroup,
  MemberInquiryManager,
  User,
} from '@libs/entity';
import { MailModule } from '../mail/mail.module';
import { InquiryController } from './inquiry.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      MemberInquiry,
      MemberInquiryAnswer,
      MemberInquiryGroup,
      MemberInquiryManager,
      Member,
      MemberAccount,
      InquiryType,
    ]),
    MailModule,
  ],
  controllers: [InquiryController],
  providers: [InquiryService, InquryAnswerService],
  exports: [InquiryService],
})
export class InquiryModule {}
