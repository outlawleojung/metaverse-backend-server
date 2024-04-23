import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Member,
  RoleType,
  Admin,
  MemberAccount,
  ProviderType,
  OfficeGradeType,
} from '@libs/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      RoleType,
      Member,
      MemberAccount,
      ProviderType,
      OfficeGradeType,
    ]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
