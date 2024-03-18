import { Module } from '@nestjs/common';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Member,
  MemberInquiry,
  MemberInquiryGroup,
  InquiryType,
  MemberInquiryAnswer,
  MemberAccount,
  MemberInquiryManager,
} from '@libs/entity';
import { AzureBlobService, CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberAccount,
      MemberInquiry,
      MemberInquiryGroup,
      MemberInquiryManager,
      InquiryType,
      MemberInquiryAnswer,
    ]),
    CommonModule,
  ],
  controllers: [InquiryController],
  providers: [InquiryService, AzureBlobService],
})
export class InquiryModule {}
