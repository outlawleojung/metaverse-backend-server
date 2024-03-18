import { Entity, OneToMany } from 'typeorm';
import { PostalLog } from './postalLog.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('postal_log_type')
export class PostalLogType extends BaseTypeEntity {
  @OneToMany(() => PostalLog, (property) => property.PostalLogType)
  PostalLogs: PostalLog[];
}
