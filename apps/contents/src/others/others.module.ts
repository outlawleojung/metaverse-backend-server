import { Module } from '@nestjs/common';
import { OthersService } from './others.service';
import { EntityModule, Member, SessionInfo } from '@libs/entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@libs/common';
import { OthersController } from './others.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, SessionInfo]),
    EntityModule,
    CommonModule,
  ],
  controllers: [OthersController],
  providers: [OthersService],
  exports: [OthersService],
})
export class OthersModule {}
