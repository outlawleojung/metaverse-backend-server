export interface RequestPayload {
  type: string;
  eventName: string;
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
  eventName: string;
  packetData: object;
}

export interface FriendInfo {
  friendMemberId: string;
  friendMemberCode: string;
  friendNickname: string;
  friendMessage: string;
  createdAt: string;
  bookmark: number;
  bookmarkedAt: string;
  avatarInfos: string;
  isOnline: boolean;
}

export interface AddWaitingClient {
  isObserver: boolean;
  clientId: string;
  nickname: string;
}

export interface RemoveWaitingClient {
  isObserver: boolean;
  clientId: string;
}

export interface OfficeUserInfo {
  clientId: string;
  screenPermission: boolean;
  chatPermission: boolean;
  voicePermission: boolean;
  videoPermission: boolean;
  authority: number;
}
