import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin, RoleType } from '@libs/entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, RoleType])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
