import {
  ClientInfo,
  GameObjectInfo,
  Item,
  Position,
  Rotation,
} from './packet-interface';
export interface PACKET {
  event: string;
}

export class C_BASE_SET_TRANSFORM implements PACKET {
  event = 'C_BASE_SET_TRANSFORM';
  objectId: number;
  Position: Position;
  Rotation: Rotation;
}

export class S_BASE_SET_TRANSFORM implements PACKET {
  event = 'S_BASE_SET_TRANSFORM';
  objectId: number;
  Position: Position;
  Rotation: Rotation;
}

export class C_BASE_SET_ANIMATION implements PACKET {
  event = 'C_BASE_SET_ANIMATION';
  objectId: number;
  animationId: string;
  animation: string;
}

export class S_BASE_SET_ANIMATION implements PACKET {
  event = 'S_BASE_SET_ANIMATION';
  objectId: number;
  animationId: string;
  animation: string;
}

export class C_BASE_SET_EMOJI implements PACKET {
  event = 'C_BASE_SET_EMOJI';
  objectId: number;
  animationId: string;
  isLoop: boolean;
  blend: number;
}

export class S_BASE_SET_EMOJI implements PACKET {
  event = 'S_BASE_SET_EMOJI';
  objectId: number;
  animationId: string;
  animation: string;
}

export class C_BASE_INSTANTIATE_OBJECT implements PACKET {
  event = 'C_BASE_INSTANTIATE_OBJECT';
  prefabName: string;
  position: Position;
  rotation: Rotation;
  objectData: string;
}

export class S_BASE_INSTANTIATE_OBJECT implements PACKET {
  event = 'S_BASE_INSTANTIATE_OBJECT';
  success: boolean;
  objectId: number;
}

export class S_BASE_SET_ANIMATION_ONCE implements PACKET {
  event = 'S_BASE_SET_ANIMATION_ONCE';
  objectId: number;
  animationId: string;
  isLoop: boolean;
  blend: number;
}

export class S_INTERACTION_GET_ITEMS implements PACKET {
  event = 'S_INTERACTION_GET_ITEMS';
  items: Item[];
}

export class C_INTERACTION_SET_ITEM implements PACKET {
  event = 'C_INTERACTION_SET_ITEM';
  id: string;
  state: string;
}

export class S_INTERACTION_SET_ITEM implements PACKET {
  event = 'S_INTERACTION_SET_ITEM';
  success: boolean;
  id: string;
  state: string;
}

export class S_INTERACTION_SET_ITEM_NOTICE implements PACKET {
  event = 'S_INTERACTION_SET_ITEM_NOTICE';
  id: string;
  state: string;
}

export class S_INTERACTION_REMOVE_ITEM implements PACKET {
  event = 'S_INTERACTION_REMOVE_ITEM';
  success: boolean;
}

export class S_INTERACTION_REMOVE_ITEM_NOTICE implements PACKET {
  event = 'S_INTERACTION_REMOVE_ITEM_NOTICE';
  id: string;
}

export class S_BASE_ADD_OBJECT implements PACKET {
  event: 'S_BASE_ADD_OBJECT';
  gameObjects: GameObjectInfo[];
}

export class S_BASE_REMOVE_OBJECT implements PACKET {
  event: 'S_BASE_REMOVE_OBJECT';
  gameObjects: number[];
}

export class C_GET_CLIENT implements PACKET {
  event: 'C_GET_CLIENT';
}

export class S_ADD_CLIENT implements PACKET {
  event: 'C_GET_CLIENT';
  clientInfo: ClientInfo[];
}
