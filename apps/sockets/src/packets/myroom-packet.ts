import {
  MY_ROOM_SOCKET_C_MESSAGE,
  MY_ROOM_SOCKET_S_MESSAGE,
} from '@libs/constants';
import { PACKET } from './packet';

export class C_MYROOM_GET_ROOMINFO implements PACKET {
  event = MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_GET_ROOMINFO;
}

export class S_MYROOM_GET_ROOMINFO implements PACKET {
  event = MY_ROOM_SOCKET_S_MESSAGE.S_MYROOM_GET_ROOMINFO;
  ownerId: string;
  ownerNickname: string;
  ownerAvatarInfo: string;
  isShutdown: boolean;
}

///

export class C_MYROOM_SET_ROOMINFO implements PACKET {
  event = MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_SET_ROOMINFO;
  roomInfo: string;
}

export class S_MYROOM_SET_ROOMINFO implements PACKET {
  event = MY_ROOM_SOCKET_S_MESSAGE.S_MYROOM_SET_ROOMINFO;
  success: boolean;
}

///

export class C_MYROOM_OTHER_ROOM_LIST implements PACKET {
  event = MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_OTHER_ROOM_LIST;
  roomInfo: string;
}

export class S_MYROOM_OTHER_ROOM_LIST implements PACKET {
  event = MY_ROOM_SOCKET_S_MESSAGE.S_MYROOM_OTHER_ROOM_LIST;
  roomInfo: string;
}

///

export class C_MYROOM_START_EDIT implements PACKET {
  event = MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_START_EDIT;
}

export class S_MYROOM_START_EDIT implements PACKET {
  event = MY_ROOM_SOCKET_S_MESSAGE.S_MYROOM_START_EDIT;
}

///

export class C_MYROOM_END_EDIT implements PACKET {
  event = MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_END_EDIT;
  isChanged: boolean;
}
export class S_MYROOM_END_EDIT implements PACKET {
  event = MY_ROOM_SOCKET_S_MESSAGE.S_MYROOM_END_EDIT;
  isChanged: boolean;
}

///

export class C_MYROOM_KICK implements PACKET {
  event = MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_KICK;
  clientId: string;
}
export class S_MYROOM_KICK implements PACKET {
  event = MY_ROOM_SOCKET_S_MESSAGE.S_MYROOM_KICK;
  success: boolean;
}

///

export class C_MYROOM_SHUTDOWN implements PACKET {
  event = MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_SHUTDOWN;
  isShutdown: boolean;
}
export class S_MYROOM_SHUTDOWN implements PACKET {
  event = MY_ROOM_SOCKET_S_MESSAGE.S_MYROOM_SHUTDOWN;
  isShutdown: boolean;
}
