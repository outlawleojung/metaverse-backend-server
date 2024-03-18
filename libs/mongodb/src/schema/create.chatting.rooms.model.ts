import * as mongoose from 'mongoose';
export const CreateFriendChattingRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
    },
    memberIds: {
      type: Object,
    },
  },
  { timestamps: true },
);

export interface CreateFriendChattingRoom extends mongoose.Document {
  _id: string;
  roomId: string;
  memberIds: object;
}
