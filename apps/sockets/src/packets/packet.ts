import {
  PLAYER_SOCKET_C_MESSAGE,
  PLAYER_SOCKET_S_MESSAGE,
} from '@libs/constants';
import { ClientInfo, Item, Position, Rotation } from './packet-interface';
import { GameObject } from '../player/game/game-object';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
export interface PACKET {
  event: string;
}

export class C_BASE_SET_TRANSFORM implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_TRANSFORM;

  @IsNumber()
  @IsNotEmpty()
  objectId: number;

  @IsObject()
  @IsNotEmpty()
  position: Position;

  @IsObject()
  @IsNotEmpty()
  rotation: Rotation;
}

export class S_BASE_SET_TRANSFORM implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_TRANSFORM;
  objectId: number;
  position: Position;
  rotation: Rotation;
}

export class C_BASE_SET_ANIMATION implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_ANIMATION;

  @IsNumber()
  @IsNotEmpty()
  objectId: number;

  @IsString()
  @IsNotEmpty()
  animationId: string;

  @IsString()
  @IsNotEmpty()
  animation: string;
}

export class S_BASE_SET_ANIMATION implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_ANIMATION;
  objectId: number;
  animationId: string;
  animation: string;
}

export class C_BASE_SET_ANIMATION_ONCE implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_ANIMATION_ONCE;

  @IsNumber()
  @IsNotEmpty()
  objectId: number;

  @IsString()
  @IsNotEmpty()
  animationId: string;

  @IsBoolean()
  @IsNotEmpty()
  isLoop: boolean;

  @IsNumber()
  @IsNotEmpty()
  blend: number;
}

export class S_BASE_SET_ANIMATION_ONCE implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_ANIMATION_ONCE;
  objectId: number;
  animationId: string;
  isLoop: boolean;
  blend: number;
}

export class C_BASE_INSTANTIATE_OBJECT implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_BASE_INSTANTIATE_OBJECT;

  @IsString()
  @IsNotEmpty()
  prefabName: string;

  @IsObject()
  @IsNotEmpty()
  position: Position;

  @IsObject()
  @IsNotEmpty()
  rotation: Rotation;

  @IsString()
  @IsNotEmpty()
  objectData: string;
}

export class S_BASE_INSTANTIATE_OBJECT implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_BASE_INSTANTIATE_OBJECT;
  success: boolean;
  objectId: number;
}

export class S_INTERACTION_GET_ITEMS implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_GET_ITEMS;
  items: string[];
}

export class C_INTERACTION_SET_ITEM implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_INTERACTION_SET_ITEM;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  state: string | null;
}

export class C_INTERACTION_REMOVE_ITEM implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_INTERACTION_REMOVE_ITEM;

  @IsString()
  @IsNotEmpty()
  id: string;
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

  @IsString()
  @IsNotEmpty()
  clientId: string;
}

export class S_REENTER implements PACKET {
  event = PLAYER_SOCKET_S_MESSAGE.S_REENTER;
  success: boolean;
}

export class C_BASE_GET_OBJECT implements PACKET {
  event = PLAYER_SOCKET_C_MESSAGE.C_BASE_GET_OBJECT;
}
