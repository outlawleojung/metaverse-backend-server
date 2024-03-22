import { Room } from '../room/room';
import { RoomType } from '../room/room-type';

export class OfficeRoom extends Room {
  ownerId: string;
  ownerNickname: string;
  ownerAvatarInfo: any;
  roomCode: string;

  constructor(roomId, sceneName, ownerId, roomCode) {
    super(roomId, RoomType.Office, sceneName);

    this.ownerId = ownerId;
    this.roomCode = roomCode;
  }
}
