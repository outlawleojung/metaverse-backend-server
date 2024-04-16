import { IRoomWithOwner } from '../room';
import { RoomType } from '../room-type';

export interface MyRoomDetails {
  roomId: string;
  sceneName: string;
  ownerId: string;
  ownerNickname: string;
  ownerAvatarInfo: object;
  isShutdown: boolean;
}

export class MyRoom implements IRoomWithOwner {
  roomId: string;
  type: RoomType;
  sceneName: string;
  ownerId: string;
  ownerNickname: string;
  ownerAvatarInfo: object;
  myRoomInfo: string;
  isShutdown: boolean;

  constructor(details: MyRoomDetails) {
    this.type = RoomType.MyRoom;
    Object.assign(this, details);
  }
}
