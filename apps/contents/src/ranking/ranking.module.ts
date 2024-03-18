import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  InfiniteCodeRank,
  Member,
  MemberInfiniteCodeRank,
  SessionInfo,
} from '@libs/entity';
import { CommonModule } from '@libs/common';
import { RankingController } from './ranking.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      InfiniteCodeRank,
      MemberInfiniteCodeRank,
      SessionInfo,
    ]),
    EntityModule,
    CommonModule,
  ],
  controllers: [RankingController],
  providers: [RankingService],
  exports: [RankingService],
})
export class RankingModule {}
