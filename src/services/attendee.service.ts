import connectDB from '@/lib/db/mongodb';
import Attendee from '@/models/Attendee.model';
import { hashPassword } from '@/lib/utils/hash';
import type { IAttendee, CreateAttendeeInput } from '@/types/attendee.types';

export async function createAttendee(
  data: CreateAttendeeInput
): Promise<IAttendee> {
  await connectDB();

  const email = data.email.toLowerCase().trim();

  const existing = await Attendee.findOne({ email });
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const hashedPassword = await hashPassword(data.password);

  const attendee = await Attendee.create({
    name: data.name.trim(),
    email,
    password: hashedPassword,
  });

  // Explicitly construct return shape — password is never included
  const result: IAttendee = {
    _id: (attendee._id as { toString(): string }).toString(),
    name: attendee.name,
    email: attendee.email,
    createdAt: attendee.createdAt,
  };

  return result;
}

export async function findAttendeeByEmail(email: string) {
  await connectDB();
  return Attendee.findOne({ email: email.toLowerCase().trim() }).select(
    '+password'
  );
}

export async function findAttendeeById(
  id: string
): Promise<IAttendee | null> {
  await connectDB();

  const attendee = await Attendee.findById(id).lean();
  if (!attendee) return null;

  // Explicitly construct return shape — password is never included
  return {
    _id: (attendee._id as { toString(): string }).toString(),
    name: attendee.name,
    email: attendee.email,
    createdAt: attendee.createdAt,
  };
}
