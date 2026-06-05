import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/nextauth';
import connectDB from '@/lib/db/mongodb';
import Event from '@/models/Event.model';
import Registration from '@/models/Registration.model';
import { createEvent } from '@/services/event.service';
import { createEventSchema } from '@/validators/event.validator';
import type { ApiResponse } from '@/types/api.types';
import type { IEvent } from '@/types/event.types';

// GET /api/events — public, returns all events with registrationCount
export async function GET(): Promise<NextResponse<ApiResponse<IEvent[]>>> {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 }).lean();

    const eventsWithCount = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({
          eventId: event._id,
        });
        return { ...(event as unknown as IEvent), registrationCount };
      })
    );

    return NextResponse.json(
      { success: true, message: 'Events fetched', data: eventsWithCount },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: message },
      { status: 500 }
    );
  }
}

// POST /api/events — host auth required
export async function POST(request: Request): Promise<NextResponse<ApiResponse<IEvent>>> {
  try {
    const session = await auth();
    if (!session?.user?.hostId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    const parsed = createEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: parsed.error.issues[0]?.message ?? 'Invalid input',
        },
        { status: 400 }
      );
    }

    const event = await createEvent(parsed.data, session.user.hostId);

    return NextResponse.json(
      { success: true, message: 'Event created', data: event },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: message },
      { status: 500 }
    );
  }
}
