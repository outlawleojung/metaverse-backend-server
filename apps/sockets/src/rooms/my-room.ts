import { Room } from '../room/room';
import { RoomType } from '../room/room-type';

export class MyRoom extends Room {
  ownerId: string;
  ownerNickname: string;
  ownerAvatarInfo: any;
  myroomInfo: string;
  isShutdown: boolean;

  constructor(roomId, sceneName, ownerId) {
    super(roomId, RoomType.MyRoom, sceneName);
    this.ownerId = ownerId;
  }
}
