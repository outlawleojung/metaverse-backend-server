import * as mongoose from 'mongoose';
export const WaitOfficeSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true },
);

export interface WaitOffice extends mongoose.Document {
  _id: string;
  roomCode: string;
  data: Object;
}
