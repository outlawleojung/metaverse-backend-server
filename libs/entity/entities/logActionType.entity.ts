import { Entity, OneToMany } from 'typeorm';
import { AdminLog } from './adminLog.entity';
import { PostalLog } from './postalLog.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('log_action_type')
export class LogActionType extends BaseTypeEntity {
  @OneToMany(() => PostalLog, (property) => property.LogActionType)
  PostalLogs: PostalLog[];

  @OneToMany(() => AdminLog, (property) => property.LogActionType)
  AdminLogs: AdminLog[];
}
