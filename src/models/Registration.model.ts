import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IRegistrationDocument extends Document {
  eventId: Types.ObjectId;
  attendeeId: Types.ObjectId;
  name: string;
  email: string;
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistrationDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    attendeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Attendee',
      required: [true, 'Attendee ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one registration per attendee per event
RegistrationSchema.index({ eventId: 1, attendeeId: 1 }, { unique: true });

const Registration: Model<IRegistrationDocument> =
  mongoose.models.Registration ??
  mongoose.model<IRegistrationDocument>('Registration', RegistrationSchema);

export default Registration;
