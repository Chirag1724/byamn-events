import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendeeDocument extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendeeSchema = new Schema<IAttendeeDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const Attendee: Model<IAttendeeDocument> =
  mongoose.models.Attendee ??
  mongoose.model<IAttendeeDocument>('Attendee', AttendeeSchema);

export default Attendee;
