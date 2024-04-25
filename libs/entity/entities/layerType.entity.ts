import { Entity, OneToMany } from 'typeorm';
import { InteriorInstallInfo } from './interiorInstallInfo.entity';
import { MemberMyRoomInfo } from './memberMyRoomInfo.entity';
import { StartMyRoom } from './startMyRoom.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('layer_type')
export class LayerType extends BaseTypeEntity {
  @OneToMany(
    () => InteriorInstallInfo,
    (interiorinstallinfo) => interiorinstallinfo.LayerType,
  )
  InteriorInstallInfos: InteriorInstallInfo[];

  @OneToMany(
    () => MemberMyRoomInfo,
    (membermyroominfo) => membermyroominfo.LayerType,
  )
  MemberMyRoomInfos: MemberMyRoomInfo[];

  @OneToMany(() => StartMyRoom, (startmyroom) => startmyroom.LayerType)
  StartMyRooms: StartMyRoom[];
}
