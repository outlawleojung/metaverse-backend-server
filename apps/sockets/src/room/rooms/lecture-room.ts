import { IRoom, IRoomWithCode, IRoomWithOwner } from '../room';
import { RoomType } from '../room-type';

export interface LectureRoomDetails {
  roomId: string;
  ownerId: string;
  roomCode: string;
  sceneName: string;
}

export class LectureRoom implements IRoomWithCode {
  roomId: string;
  type: RoomType;
  sceneName: string;
  ownerId: string;
  ownerNickname: string;
  ownerAvatarInfo: any;
  roomCode: string;

  constructor(details: LectureRoomDetails) {
    this.type = RoomType.Office;
    Object.assign(this, details);
  }
}
