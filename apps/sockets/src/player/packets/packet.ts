import {
  PLAYER_SOCKET_C_MESSAGE,
  PLAYER_SOCKET_S_MESSAGE,
} from '@libs/constants';
import {
  ClientInfo,
  GameObjectInfo,
  Item,
  Position,
  Rotation,
} from './packet-interface';
import { GameObject } from '../game/game-object';
import { IsNotEmpty, IsString } from 'class-validator';
export interface PACKET {
  event: string;
}

export class C_BASE_SET_TRANSFORM implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_TRANSFORM;
  objectId: number;
  Position: Position;
  Rotation: Rotation;
}

export class S_BASE_SET_TRANSFORM implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_TRANSFORM;
  objectId: number;
  Position: Position;
  Rotation: Rotation;
}

export class C_BASE_SET_ANIMATION implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_ANIMATION;
  objectId: number;
  animationId: string;
  animation: string;
}

export class S_BASE_SET_ANIMATION implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_ANIMATION;
  objectId: number;
  animationId: string;
  animation: string;
}

export class C_BASE_SET_EMOJI implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_EMOJI;
  objectId: number;
  animationId: string;
  isLoop: boolean;
  blend: number;
}

export class S_BASE_SET_EMOJI implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_EMOJI;
  objectId: number;
  animationId: string;
  animation: string;
}

export class C_BASE_INSTANTIATE_OBJECT implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_BASE_INSTANTIATE_OBJECT;
  prefabName: string;
  position: Position;
  rotation: Rotation;
  objectData: string;
}

export class S_BASE_INSTANTIATE_OBJECT implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_INSTANTIATE_OBJECT;
  success: boolean;
  objectId: number;
}

export class S_BASE_SET_ANIMATION_ONCE implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_ANIMATION_ONCE;
  objectId: number;
  animationId: string;
  isLoop: boolean;
  blend: number;
}

export class S_INTERACTION_GET_ITEMS implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_GET_ITEMS;
  items: Item[];
}

export class C_INTERACTION_SET_ITEM implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_INTERACTION_SET_ITEM;
  id: string;
  state: string;
}

export class S_INTERACTION_SET_ITEM implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_SET_ITEM;
  success: boolean;
  id: string;
  state: string;
}

export class S_INTERACTION_SET_ITEM_NOTICE implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_SET_ITEM_NOTICE;
  id: string;
  state: string;
}

export class S_INTERACTION_REMOVE_ITEM implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_REMOVE_ITEM;
  success: boolean;
}

export class S_INTERACTION_REMOVE_ITEM_NOTICE implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_REMOVE_ITEM_NOTICE;
  id: string;
}

export class S_BASE_ADD_OBJECT implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_ADD_OBJECT;
  gameObjects: GameObject[] = [];
}

export class S_BASE_REMOVE_OBJECT implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_REMOVE_OBJECT;
  gameObjects: number[];
}

export class C_GET_CLIENT implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_GET_CLIENT;
}

export class S_ADD_CLIENT implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_ADD_CLIENT;
  clientInfo: ClientInfo[];
}

export class C_ENTER implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_ENTER;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  sceneName: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  // for office
  password: string;
  isObserver: boolean;
}

export class S_ENTER implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_ENTER;
  result: string;
}

export class C_REENTER implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_REENTER;
  clientId: string;
}

export class S_REENTER implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_REENTER;
  success: boolean;
}

export class C_BASE_GET_OBJECT implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_BASE_GET_OBJECT;
}
