import { Entity, OneToMany } from 'typeorm';
import { AdminLog } from './adminLog.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('log_content_type')
export class LogContentType extends BaseTypeEntity {
  @OneToMany(() => AdminLog, (log) => log.LogContentType)
  AdminLogs: AdminLog[];
}
