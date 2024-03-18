import { Module } from '@nestjs/common';
import { PassController } from './pass.controller';
import { PassService } from './pass.service';

@Module({
  controllers: [PassController],
  providers: [PassService],
})
export class PassModule {}
