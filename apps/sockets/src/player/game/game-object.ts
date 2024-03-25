import { S_BASE_ADD_OBJECT } from '../packets/packet';
import {
  GameObjectInfo,
  Position,
  Rotation,
} from '../packets/packet-interface';

export interface IGameObject {
  objectId: number;
  prefabName: string;
  objectData: string;
  ownerId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  animations: Map<string, string>;

  makeGameObjectInfo(data: GameObjectInfo): void;
  makeTransform(): void;

  setPosition(position: Position): void;
  setRotation(rotation: Rotation): void;
  setObjectData(data: string): void;
  setAnimations(animationId: string, animationValue: string): void;

  getAnimations(animationId: string): string;
}

export class GameObject implements IGameObject {
  objectId: number;
  prefabName: string;
  objectData: string;
  ownerId: string;
  position: Position;
  rotation: Rotation;
  animations: Map<string, string> = new Map();

  constructor(
    objectId: number,
    prefabName: string,
    position: Position,
    rotation: Rotation,
    objectData: string,
    ownerId: string,
  ) {
    this.objectId = objectId;
    this.prefabName = prefabName;
    this.position = position;
    this.rotation = rotation;
    this.objectData = objectData;
    this.ownerId = ownerId;
  }

  setAnimations(animationId: string, animationValue: string): void {
    this.animations.set(animationId, animationValue);
  }

  makeGameObjectInfo(data: GameObjectInfo): void {
    this.objectId = data.objectId;
    this.prefabName = data.prefabName;
    this.position = data.position;
    this.rotation = data.rotation;
    this.objectData = data.objectData;
    this.ownerId = data.ownerId;
  }
  makeTransform(): void {
    throw new Error('Method not implemented.');
  }

  setPosition(position: Position): void {
    this.position = position;
  }

  setRotation(rotation: Rotation): void {
    this.rotation = rotation;
  }

  setObjectData(data: string): void {
    this.objectData = data;
  }

  getAnimations(animationId: string): string {
    return this.animations.get(animationId);
  }
}
