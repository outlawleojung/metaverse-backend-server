import { IRoomWithOwner } from '../room/room';
import { RoomType } from '../room/room-type';

export interface MyRoomDetails {
  roomId: string;
  sceneName: string;
  ownerId: string;
}

export class MyRoom implements IRoomWithOwner {
  roomId: string;
  type: RoomType;
  sceneName: string;
  ownerId: string;
  ownerNickname: string;
  ownerAvatarInfo: any;
  myRoomInfo: string;
  isShutdown: boolean;

  constructor(details: MyRoomDetails) {
    this.type = RoomType.MyRoom;
    Object.assign(this, details);
  }
}
