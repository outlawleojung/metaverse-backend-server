import * as mongoose from 'mongoose';
export const OneOnOneChattingLogSchema = new mongoose.Schema(
  {
    sendMemberId: {
      type: String,
      required: true,
    },
    sendNickname: {
      type: String,
      required: true,
    },
    recvMemberId: {
      type: String,
      required: true,
    },
    recvNickname: {
      type: String,
      required: true,
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

export interface OneOnOneChattingLog extends mongoose.Document {
  _id: string;
  sendMemberId: string;
  sendNickname: string;
  recvMemberId: string;
  recvNickname: string;
  chatMessage: string;
}
