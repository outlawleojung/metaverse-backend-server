import * as mongoose from 'mongoose';
export const ChattingMemberInfoSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      unique: true,
    },
    rooms: {
      type: Array,
    },
  },
  { timestamps: true },
);

export interface ChattingMemberInfo extends mongoose.Document {
  _id: string;
  memberId: string;
  rooms: Array<string>;
}
