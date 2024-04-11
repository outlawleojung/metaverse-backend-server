import { IRoom, IRoomWithCode, IRoomWithOwner } from '../room';
import { RoomType } from '../room-type';

export interface MeetingRoomDetails {
  roomId: string;
  sceneName: string;
  roomName: string;
  roomCode: string;
  creatorId: string;
  description: string;
  spaceInfoId: string;
  topicType: number;
  thumbnail: string;
  currentHostId: string;
  password: string;
  isAdvertising: boolean;
  isShutdown: boolean;
  isWaitingRoom: boolean;
  runningTime: number;
  passedTime: number;
  createdTime: number;
  createdTimeString: string;
  endTimeString: string;
  personnel: number;
}

export class MeetingRoom implements IRoomWithCode {
  roomId: string;
  type: RoomType;
  sceneName: string;
  roomName: string;
  roomCode: string;
  creatorId: string;
  description: string;
  spaceInfoId: string;
  thumbnail: string;
  currentHostId: string;
  password: string;
  isPassword: string;
  createdTimeString: string;
  endTimeString: string;

  topicType: number;
  runningTime: number;
  passedTime: number;
  createdTime: number;
  maxPlayerNumber: number;
  observer: number;
  modeType: number;

  isAdvertising: boolean;
  isShutdown: boolean;
  isWaitingRoom: boolean;

  constructor(details: MeetingRoomDetails) {
    this.type = RoomType.Office;
    this.isPassword = details.password || null;
    this.maxPlayerNumber = details.personnel;
    this.observer = 0;
    this.modeType = 1;

    Object.assign(this, details);
  }
}
