export interface RequestPayload {
  type: string;
  event: string;
  data: any;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Rotation {
  x: number;
  y: number;
  z: number;
}

export interface Item {
  id: string;
  state: string;
}

export interface GameObjectInfo {
  objectId: number;
  position: Position;
  rotation: Rotation;
  prefabName: string;
  objectData: string;
  ownerId: string;
  animationId: string;
  isLoop: boolean;
  blend: number;
}

export interface ClientInfo {
  clientId: string;
  nickname: string;
  stateMessage: string;
}

export interface GetGameObjectInfo {
  memberId: string;
  gatewayId: string;
}

export interface PacketInfo {
  event: string;
  packetData: object;
}
