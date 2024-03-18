import { APPEND_TYPE, LOG_ACTION_TYPE, POSTAL_LOG_TYPE } from '@libs/constants';
import { AppendType, Item, PostalLog } from '@libs/entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class PostalLogService {
  constructor(@Inject(DataSource) private dataSource: DataSource) {}
  private readonly logger = new Logger(PostalLogService.name);

  async createLog(
    queryRunner: QueryRunner,
    postboxId: number,
    adminId: number,
  ) {
    return true;
  }

  async updateLog(
    queryRunner: QueryRunner,
    postboxId: number,
    adminId: number,
    prevData: any,
    changeData: any,
  ) {
    return true;
  }

  private async appendItemGenerator(data: any) {
    return true;
    let appendType;
  }
}
