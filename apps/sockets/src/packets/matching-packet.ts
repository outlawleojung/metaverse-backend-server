import {
  MATCHING_SOCKET_C_MESSAGE,
  MATCHING_SOCKET_S_MESSAGE,
} from '@libs/constants';
import { PACKET } from './packet';

export class C_MATCHING_START implements PACKET {
  eventName = MATCHING_SOCKET_C_MESSAGE.C_MATCHING_START;
}

export class S_MATCHING_START implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_START;
}

export class S_MATCHING_AWARD implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_AWARD;
  winners: string[];
}

export class S_MATCHING_FINISH implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_FINISH;
}

///

export class C_MATCHING_GET_HOST implements PACKET {
  eventName = MATCHING_SOCKET_C_MESSAGE.C_MATCHING_GET_HOST;
  roomId: string;
}

export class S_MATCHING_HOST implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_HOST;
  clientId: string;
}

export class S_MATCHING_ROUND_START implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_ROUND_START;
}

export class S_MATCHING_ROUND_FINISH implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_ROUND_FINISH;
  clientId: string;
}

///

export class S_MATCHING_TILES implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_TILES;
  tiles: string[];
}

export class S_MATCHING_HINT implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_HINT;
  hints: boolean[];
}

export class S_MATCHING_PROBLEM implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_PROBLEM;
  problem: string;
  timeToDestroy: number;
}

///

export class S_MATCHING_DESTROY implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_DESTROY;
}

export class S_MATCHING_QUIZ_DISAPPEAR implements PACKET {
  eventName = MATCHING_SOCKET_S_MESSAGE.S_MATCHING_QUIZ_DISAPPEAR;
}

export class C_MATCHING_DIE implements PACKET {
  eventName = MATCHING_SOCKET_C_MESSAGE.C_MATCHING_DIE;
}
