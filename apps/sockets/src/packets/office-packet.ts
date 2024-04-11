import {
  AddWaitingClient,
  OfficeUserInfo,
  RemoveWaitingClient,
} from './packet-interface';
import {
  OFFICE_SOCKET_C_MESSAGE,
  OFFICE_SOCKET_S_MESSAGE,
} from '@libs/constants';
import { PACKET } from './packet';

export class C_OFFICE_GET_WAITING_LIST implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_GET_WAITING_LIST;
}

export class S_OFFICE_ADD_WAITING_CLIENT implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_ADD_WAITING_CLIENT;
  clients: AddWaitingClient[];
}

export class S_OFFICE_REMOVE_WAITING_CLIENT implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_REMOVE_WAITING_CLIENT;
  clients: RemoveWaitingClient[];
}

///

export class C_OFFICE_ACCEPT_WAIT implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_ACCEPT_WAIT;
  clientId: string;
  isAccepted: boolean;
}

export class S_OFFICE_ACCEPT_WAIT implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_ACCEPT_WAIT;
  success: boolean;
}

export class S_OFFICE_ACCEPT_WAIT_NOTICE implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_ACCEPT_WAIT_NOTICE;
  isAccepted: boolean;
}

///

export class C_OFFICE_GET_HOST implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_GET_HOST;
}

export class S_OFFICE_GET_HOST implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_GET_HOST;
  clientId: string;
}

///

export class C_OFFICE_BREAK implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_BREAK;
}

export class S_OFFICE_BREAK implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_BREAK;
  success: boolean;
}

///

export class C_OFFICE_KICK implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_KICK;
  clientId: string;
}
export class S_OFFICE_KICK implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_KICK;
  success: boolean;
}

///

export class C_OFFICE_GET_PERMISSION implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_GET_PERMISSION;
  clientId: string;
}
export class S_OFFICE_GET_PERMISSION implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_GET_PERMISSION;
  permission: OfficeUserInfo;
}

///

export class C_OFFICE_GET_PERMISSION_ALL implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_GET_PERMISSION_ALL;
}
export class S_OFFICE_GET_PERMISSION_ALL implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_GET_PERMISSION_ALL;
  permissions: OfficeUserInfo[];
}

///

export class C_OFFICE_SET_PERMISSION implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_SET_PERMISSION;
  permissions: OfficeUserInfo[];
}

export class S_OFFICE_SET_PERMISSION implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_SET_PERMISSION;
  code: string;
}

///

export class C_OFFICE_SET_ROOM_INFO implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_SET_ROOM_INFO;
  personnel: number;
  password: string;
  isShutdown: boolean;
  isAdvertising: boolean;
  isWaitingRoom: boolean;
  runningTime: number;
  thumbnail: string;
  observer: number;
}

export class S_OFFICE_SET_ROOM_INFO implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_SET_ROOM_INFO;
  success: boolean;
}

///

export class C_OFFICE_GET_ROOM_INFO implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_GET_ROOM_INFO;
}

export class S_OFFICE_GET_ROOM_INFO implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_GET_ROOM_INFO;
  roomName: string;
  description: string;
  topicType: number;
  password: string;
  spaceInfoId: string;
  personnel: number;
  currentPersonnel: number;
  observer: number;
  currentObserver: number;
  currentWaiting: number;
  isAdvertising: boolean;
  thumbnail: string;
  isWaitingRoom: boolean;
  isShutdown: boolean;
  runningTime: number;
  passedTime: number;
  startTime: string;
  roomcode: string;
  hostNickname: string;
}

///

export class C_OFFICE_VIDEO_STREAM implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_VIDEO_STREAM;
  clientid: string;
  url: string;
  volume: number;
  time: number;
  play: boolean;
  seek: boolean;
  mediaPlayerState: number;
}

export class C_OFFICE_GET_VIDEO_STREAM implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_GET_VIDEO_STREAM;
}

export class S_OFFICE_VIDEO_STREAM implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_VIDEO_STREAM;
  clientid: string;
  url: string;
  volume: number;
  time: number;
  play: boolean;
  seek: boolean;
  mediaPlayerState: number;
}

///

export class C_OFFICE_SHARE implements PACKET {
  eventName = OFFICE_SOCKET_C_MESSAGE.C_OFFICE_SHARE;
  isShared: boolean;
  userId: number;
}

export class S_OFFICE_SHARE implements PACKET {
  eventName = OFFICE_SOCKET_S_MESSAGE.S_OFFICE_SHARE;
  isShared: boolean;
  userId: number;
}
