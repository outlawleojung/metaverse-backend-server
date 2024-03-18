import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RoleType, User } from '@libs/entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, RoleType])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
