import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';
import { EntityModule, Member, MemberAccount } from '@libs/entity';
import { CommonModule } from '@libs/common';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([Member, MemberAccount]),
    CommonModule,
    EntityModule,
  ],
  providers: [LocalStrategy, LocalSerializer],
})
export class AuthModule {}
