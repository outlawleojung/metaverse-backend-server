import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ServerType } from './serverType.entity';

@Index('serverType', ['serverType'], { unique: true })
@Entity('server_info')
export class ServerInfo {
  @PrimaryColumn('int')
  serverType: number;

  @Column('varchar', { length: 100 })
  accountServerUrl: string;

  @Column('varchar', { length: 100 })
  agoraServerUrl: string;

  @Column('varchar', { length: 100 })
  contentServerUrl: string;

  @Column('varchar', { length: 100 })
  lobbyServerUrl: string;

  @Column('varchar', { length: 100 })
  meetingRoomServerUrl: string;

  @Column('int')
  meetingRoomServerPort: number;

  @Column('varchar', { nullable: true, length: 100 })
  myRoomServerUrl: string | null;

  @Column('int', { nullable: true })
  medicinePort: number | null;

  @Column('varchar', { nullable: true, length: 100 })
  medicineUrl: string | null;

  @Column('int', { nullable: true })
  myRoomServerPort: number | null;

  @Column('varchar', { length: 100 })
  matchingServerUrl: string;

  @Column('int')
  matchingServerPort: number;

  @Column('varchar', { length: 100 })
  oxServerUrl: string;

  @Column('int')
  oxServerPort: number;

  @Column('varchar', { length: 100 })
  storageUrl: string;

  @Column('varchar', { length: 100 })
  homepageUrl: string;

  @Column('varchar', { length: 100 })
  homepageBackendUrl: string;

  @Column('varchar', { length: 100 })
  webviewUrl: string;

  @Column('int')
  gameServerPort: number;

  @Column('varchar', { length: 64 })
  linuxServerIp: string;

  @Column('int')
  linuxServerPort: number;

  @Column('int')
  linuxHttpPort: number;

  @Column('varchar', { length: 128 })
  webSocketUrl: string;

  @Column('varchar', { length: 128 })
  pcAccountServerUrl: string;

  @Column('varchar', { length: 128 })
  youtubeDlUrl: string;

  @OneToOne(() => ServerType, (servertype) => servertype.ServerInfo, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'serverType' })
  ServerType: ServerType;
}
