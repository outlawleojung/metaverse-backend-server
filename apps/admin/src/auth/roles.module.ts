import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleType, User } from '@libs/entity';
import { RolesService } from './roles.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, RoleType])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    RolesService,
  ],
  exports: [RolesService],
})
export class RolesModule {}
