import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ServerType } from './serverType.entity';

@Index('serverType', ['serverType'], { unique: true })
@Entity('server_info')
export class ServerInfo {
  @PrimaryColumn('int', { name: 'serverType' })
  serverType: number;

  @Column('varchar', { name: 'accountServerUrl', length: 100 })
  accountServerUrl: string;

  @Column('varchar', { name: 'agoraServerUrl', length: 100 })
  agoraServerUrl: string;

  @Column('varchar', { name: 'contentServerUrl', length: 100 })
  contentServerUrl: string;

  @Column('varchar', { name: 'lobbyServerUrl', length: 100 })
  lobbyServerUrl: string;

  @Column('varchar', { name: 'meetingRoomServerUrl', length: 100 })
  meetingRoomServerUrl: string;

  @Column('int', { name: 'meetingRoomServerPort' })
  meetingRoomServerPort: number;

  @Column('varchar', { name: 'myRoomServerUrl', nullable: true, length: 100 })
  myRoomServerUrl: string | null;

  @Column('int', { name: 'medicinePort', nullable: true })
  medicinePort: number | null;

  @Column('varchar', { name: 'medicineUrl', nullable: true, length: 100 })
  medicineUrl: string | null;

  @Column('int', { name: 'myRoomServerPort', nullable: true })
  myRoomServerPort: number | null;

  @Column('varchar', { name: 'matchingServerUrl', length: 100 })
  matchingServerUrl: string;

  @Column('int', { name: 'matchingServerPort' })
  matchingServerPort: number;

  @Column('varchar', { name: 'OXServerUrl', length: 100 })
  oxServerUrl: string;

  @Column('int', { name: 'OXServerPort' })
  oxServerPort: number;

  @Column('varchar', { name: 'storageUrl', length: 100 })
  storageUrl: string;

  @Column('varchar', { name: 'homepageUrl', length: 100 })
  homepageUrl: string;

  @Column('varchar', { name: 'homepageBackendUrl', length: 100 })
  homepageBackendUrl: string;

  @Column('varchar', { name: 'webviewUrl', length: 100 })
  webviewUrl: string;

  @Column('int', { name: 'gameServerPort' })
  gameServerPort: number;

  @Column('varchar', { name: 'linuxServerIp', length: 64 })
  linuxServerIp: string;

  @Column('int', { name: 'linuxServerPort' })
  linuxServerPort: number;

  @Column('int', { name: 'linuxHttpPort' })
  linuxHttpPort: number;

  @Column('varchar', { name: 'webSocketUrl', length: 128 })
  webSocketUrl: string;

  @Column('varchar', { name: 'pcAccountServerUrl', length: 128 })
  pcAccountServerUrl: string;

  @Column('varchar', { name: 'youtubeDlUrl', length: 128 })
  youtubeDlUrl: string;

  @OneToOne(() => ServerType, (servertype) => servertype.ServerInfo, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'serverType', referencedColumnName: 'type' }])
  ServerType: ServerType;
}
