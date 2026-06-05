import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IEventDocument extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  slug: string;
  hostId: Types.ObjectId;
  capacity?: number;
  registrationCutoff?: Date;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'Host',
      required: [true, 'Host ID is required'],
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
    },
    registrationCutoff: {
      type: Date,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Event: Model<IEventDocument> =
  mongoose.models.Event ??
  mongoose.model<IEventDocument>('Event', EventSchema);

export default Event;
