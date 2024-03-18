import * as mongoose from 'mongoose';
export const WorldChattingLogSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: true,
    },
    memberCode: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    roomCode: {
      type: String,
    },
    roomName: {
      type: String,
    },
    chatMessage: {
      type: String,
      required: true,
    },
    kstCreatedAt: {
      type: String,
    },
  },
  { timestamps: true },
);

export interface WorldChattingLog extends mongoose.Document {
  _id: string;
  memberId: string;
  nickName: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  chatMessage: string;
}
