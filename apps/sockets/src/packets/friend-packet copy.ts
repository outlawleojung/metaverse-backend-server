import {
  FRIEND_SOCKET_C_MESSAGE,
  FRIEND_SOCKET_S_MESSAGE,
} from '@libs/constants';
import { PACKET } from './packet';
import { FriendInfo } from './packet-interface';

export class C_FRIEND_LIST implements PACKET {
  eventName = FRIEND_SOCKET_C_MESSAGE.C_FRIEND_LIST;
}

export class S_FRIEND_LIST implements PACKET {
  eventName = FRIEND_SOCKET_S_MESSAGE.S_FRIEND_LIST;
  friends: FriendInfo[];
}

///

export class C_FRIEND_FOLLOW implements PACKET {
  eventName = FRIEND_SOCKET_C_MESSAGE.C_FRIEND_FOLLOW;
  friendMemberId: string;
}

export class S_FRIEND_FOLLOW implements PACKET {
  eventName = FRIEND_SOCKET_S_MESSAGE.S_FRIEND_FOLLOW;
  code: number;
  roomId: string;
  sceneName: string;
  memberCode: string;
  nickName: string;
  myRoomStateType: number;
}

export class C_FRIEND_BRING implements PACKET {
  eventName = FRIEND_SOCKET_C_MESSAGE.C_FRIEND_BRING;
  friendMemberId: string;
}

export class S_FRIEND_BRING implements PACKET {
  eventName = FRIEND_SOCKET_S_MESSAGE.S_FRIEND_BRING;
  code: number;
  roomId: string;
  sceneName: string;
  memberCode: string;
  nickName: string;
  myRoomStateType: number;
}
