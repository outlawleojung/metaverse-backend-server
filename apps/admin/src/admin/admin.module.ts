import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin, LicenseGroupInfo, LicenseInfo, RoleType } from '@libs/entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from '../common/common.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, RoleType, LicenseInfo, LicenseGroupInfo]),
  ],
  providers: [AdminService, CommonService],
  controllers: [AdminController],
})
export class AdminModule {}
