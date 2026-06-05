import connectDB from '@/lib/db/mongodb';
import Event from '@/models/Event.model';
import Registration from '@/models/Registration.model';
import { generateSlug } from '@/lib/utils/slug';
import type { IEvent, CreateEventInput } from '@/types/event.types';

export async function createEvent(
  data: CreateEventInput,
  hostId: string
): Promise<IEvent> {
  await connectDB();

  const slug = generateSlug(data.title);

  const event = await Event.create({
    title: data.title.trim(),
    description: data.description.trim(),
    date: new Date(data.date),
    time: data.time.trim(),
    location: data.location.trim(),
    slug,
    hostId,
    ...(data.capacity !== undefined && { capacity: data.capacity }),
    ...(data.registrationCutoff && {
      registrationCutoff: new Date(data.registrationCutoff),
    }),
  });

  return event.toObject() as unknown as IEvent;
}

export async function getEventBySlug(
  slug: string
): Promise<(IEvent & { registrationCount: number }) | null> {
  await connectDB();

  const event = await Event.findOne({ slug }).lean();
  if (!event) return null;

  const registrationCount = await Registration.countDocuments({
    eventId: event._id,
  });

  return {
    ...(event as unknown as IEvent),
    registrationCount,
  };
}

export async function getHostEvents(hostId: string): Promise<IEvent[]> {
  await connectDB();

  const events = await Event.find({ hostId }).sort({ createdAt: -1 }).lean();

  const eventsWithCount = await Promise.all(
    events.map(async (event) => {
      const registrationCount = await Registration.countDocuments({
        eventId: event._id,
      });
      return {
        ...(event as unknown as IEvent),
        registrationCount,
      };
    })
  );

  return eventsWithCount;
}

export async function closeEvent(
  eventId: string,
  hostId: string
): Promise<IEvent | null> {
  await connectDB();

  const event = await Event.findOne({ _id: eventId, hostId });
  if (!event) {
    throw new Error(
      'Event not found or you do not have permission to close it.'
    );
  }

  event.isClosed = true;
  await event.save();

  return event.toObject() as unknown as IEvent;
}

export async function deleteEvent(
  eventId: string,
  hostId: string
): Promise<boolean> {
  await connectDB();

  const event = await Event.findOne({ _id: eventId, hostId });
  if (!event) {
    throw new Error(
      'Event not found or you do not have permission to delete it.'
    );
  }

  // Delete all registrations for this event first
  await Registration.deleteMany({ eventId });

  // Delete the event itself
  await Event.deleteOne({ _id: eventId });

  return true;
}
