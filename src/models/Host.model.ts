import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHostDocument extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const HostSchema = new Schema<IHostDocument>(
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

const Host: Model<IHostDocument> =
  mongoose.models.Host ??
  mongoose.model<IHostDocument>('Host', HostSchema);

export default Host;
