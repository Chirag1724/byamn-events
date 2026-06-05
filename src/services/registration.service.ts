import connectDB from '@/lib/db/mongodb';
import Event from '@/models/Event.model';
import Registration from '@/models/Registration.model';
import { createAttendee, findAttendeeByEmail } from '@/services/attendee.service';
import { generateCSV } from '@/lib/utils/csv';
import type { CreateAttendeeInput } from '@/types/attendee.types';
import type { RegistrationRow } from '@/types/api.types';

export async function registerForEvent(
  eventId: string,
  attendeeData: CreateAttendeeInput
): Promise<RegistrationRow> {
  await connectDB();

  // 1. Find and validate the event
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found.');
  }

  // 2. Check if event is closed
  if (event.isClosed) {
    throw new Error('Event is closed for registration.');
  }

  // 3. Check registration cutoff
  if (event.registrationCutoff && new Date() > event.registrationCutoff) {
    throw new Error('Registration deadline has passed.');
  }

  // 4. Check capacity
  if (event.capacity !== undefined && event.capacity !== null) {
    const currentCount = await Registration.countDocuments({ eventId });
    if (currentCount >= event.capacity) {
      throw new Error('Event is full. No more registrations are being accepted.');
    }
  }

  // 5. Find or create attendee
  let attendee = await findAttendeeByEmail(attendeeData.email);
  if (!attendee) {
    await createAttendee(attendeeData);
    attendee = await findAttendeeByEmail(attendeeData.email);
  }

  if (!attendee) {
    throw new Error('Failed to create or retrieve attendee account.');
  }

  const attendeeId = attendee._id;

  // 6. Check for duplicate registration
  const duplicate = await Registration.findOne({ eventId, attendeeId });
  if (duplicate) {
    throw new Error('You are already registered for this event.');
  }

  // 7. Create the registration
  const registration = await Registration.create({
    eventId,
    attendeeId,
    name: attendee.name as string,
    email: attendee.email as string,
  });

  return {
    name: registration.name,
    email: registration.email,
    registeredAt: registration.registeredAt,
  };
}

export async function getEventRegistrations(
  eventId: string,
  hostId: string
): Promise<RegistrationRow[]> {
  await connectDB();

  // Verify the requesting host owns this event
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found.');
  }
  if (event.hostId.toString() !== hostId) {
    throw new Error('You are not authorized to view these registrations.');
  }

  const registrations = await Registration.find({ eventId })
    .sort({ registeredAt: 1 })
    .lean();

  return registrations.map((r) => ({
    name: r.name,
    email: r.email,
    registeredAt: r.registeredAt,
  }));
}

export async function getAttendeeRegistrations(attendeeId: string) {
  await connectDB();

  const registrations = await Registration.find({ attendeeId })
    .populate('eventId')
    .sort({ registeredAt: -1 })
    .lean();

  return registrations;
}

export async function cancelRegistration(
  registrationId: string,
  attendeeId: string
): Promise<boolean> {
  await connectDB();

  const registration = await Registration.findOne({
    _id: registrationId,
    attendeeId,
  });

  if (!registration) {
    throw new Error(
      'Registration not found or you do not have permission to cancel it.'
    );
  }

  await Registration.deleteOne({ _id: registrationId });

  return true;
}

export async function exportRegistrationsCSV(
  eventId: string,
  hostId: string
): Promise<string> {
  const registrations = await getEventRegistrations(eventId, hostId);
  return generateCSV(registrations);
}
