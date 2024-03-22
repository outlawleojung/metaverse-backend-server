import { IRoom, IRoomWithCode, IRoomWithOwner } from './../room/room';
import { RoomType } from '../room/room-type';

export interface OfficeRoomDetails {
  roomId: string;
  ownerId: string;
  roomCode: string;
  sceneName: string;
}

export class OfficeRoom implements IRoomWithCode, IRoomWithOwner {
  roomId: string;
  type: RoomType;
  sceneName: string;
  ownerId: string;
  ownerNickname: string;
  ownerAvatarInfo: any;
  roomCode: string;

  constructor(details: OfficeRoomDetails) {
    Object.assign(this, details);
  }
}
