import * as mongoose from 'mongoose';
export const CreateOfficeSchema = new mongoose.Schema(
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

export interface CreateOffice extends mongoose.Document {
  _id: string;
  roomCode: string;
  data: Object;
}
