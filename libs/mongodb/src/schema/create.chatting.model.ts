import * as mongoose from 'mongoose';
export const CreateFriendChattingSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      unique: true,
    },
    roomId: {
      type: String,
    },
    memberId: {
      type: String,
    },
    message: {
      type: String,
    },
    unReadMembers: {
      type: Object,
    },
  },
  { timestamps: true },
);

export interface CreateFriendChatting extends mongoose.Document {
  _id: string;
  messageId: string;
  roomId: string;
  content: object;
  isRead: boolean;
}
