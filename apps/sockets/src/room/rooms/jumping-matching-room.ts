import { IRoomWithOwner } from '../room';
import { RoomType } from '../room-type';

export interface JumpingMatchingRoomDetails {
  roomId: string;
  ownerId: string;
  roomName: string;
  maxPlayerNumber: number;
}

export class JumpingMatchingRoom implements IRoomWithOwner {
  roomId: string;
  type: RoomType;
  sceneName: string;
  ownerId: string;
  ownerNickname: string;
  ownerAvatarInfo: object;
  roomName: string;
  isPlaying: boolean;
  curruentPlayerNumber: number;
  maxPlayerNumber: number;

  constructor(details: JumpingMatchingRoomDetails) {
    this.type = RoomType.JumpingMatching;
    this.isPlaying = false;
    this.curruentPlayerNumber = 0;
    this.sceneName = 'Scene_Room_JumpingMatching';

    Object.assign(this, details);
  }
}
