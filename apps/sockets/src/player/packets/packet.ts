import { Position, Rotation } from './packet-interface';

export interface C_BASE_SET_TRANSFORM {
  ObjectID: number;
  Position: Position;
  Rotation: Rotation;
}

export interface S_BASE_SET_TRANSFORM {
  ObjectID: number;
  Position: Position;
  Rotation: Rotation;
}

export interface C_BASE_SET_ANIMATION {
  ObjectID: number;
  AnimationId: string;
  Animation: string;
}

export interface S_BASE_SET_ANIMATION {
  ObjectID: number;
  AnimationId: string;
  Animation: string;
}

export interface C_BASE_SET_EMOJI {
  ObjectID: number;
  AnimationId: string;
  IsLoop: boolean;
  Blend: number;
}

export interface S_BASE_SET_EMOJI {
  ObjectID: number;
  AnimationId: string;
  Animation: string;
}
