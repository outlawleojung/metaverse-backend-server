import * as mongoose from 'mongoose';
export const RoomDataLogSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
    },
    nickname: {
      type: String,
    },
    roomCode: {
      type: String,
      index: true,
    },
    roomName: {
      type: String,
    },
    description: {
      type: String,
    },
    kstCreatedAt: {
      type: String,
    },
  },
  { timestamps: true },
);

export interface RoomDataLog extends mongoose.Document {
  _id: string;
  memberId: string;
  rooms: Array<string>;
}
