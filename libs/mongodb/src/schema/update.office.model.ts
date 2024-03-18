import * as mongoose from 'mongoose';
export const UpdateOfficeSchema = new mongoose.Schema(
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

export interface UpdateOffice extends mongoose.Document {
  _id: string;
  roomCode: string;
  data: Object;
}
