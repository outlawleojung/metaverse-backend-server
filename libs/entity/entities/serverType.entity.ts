import { Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { Gateway } from './gateway.entity';
import { ServerInfo } from './serverInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Index('type', ['type'], { unique: true })
@Entity('server_type')
export class ServerType extends BaseTypeEntity {
  @OneToMany(() => Gateway, (gateway) => gateway.ServerType)
  gateways: Gateway[];

  @OneToOne(() => ServerInfo, (serverinfo) => serverinfo.ServerType)
  ServerInfo: ServerInfo;
}
