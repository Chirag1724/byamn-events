import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/nextauth';
import { getEventBySlug, closeEvent, deleteEvent } from '@/services/event.service';
import connectDB from '@/lib/db/mongodb';
import Event from '@/models/Event.model';
import Registration from '@/models/Registration.model';
import type { ApiResponse } from '@/types/api.types';
import type { IEvent } from '@/types/event.types';

interface RouteContext {
  params: Promise<{ eventId: string }>;
}

// GET /api/events/[eventId] — public
export async function GET(
  _request: Request,
  context: RouteContext
): Promise<NextResponse<ApiResponse<IEvent>>> {
  try {
    const { eventId } = await context.params;
    await connectDB();

    const event = await Event.findById(eventId).lean();
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    const registrationCount = await Registration.countDocuments({ eventId });

    return NextResponse.json(
      {
        success: true,
        message: 'Event fetched',
        data: { ...(event as unknown as IEvent), registrationCount },
      },
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

// PATCH /api/events/[eventId] — host auth
export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<NextResponse<ApiResponse<IEvent>>> {
  try {
    const session = await auth();
    if (!session?.user?.hostId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventId } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;

    // If isClosed flag is being set to true, use the closeEvent service
    if (body.isClosed === true) {
      const updated = await closeEvent(eventId, session.user.hostId);
      return NextResponse.json(
        { success: true, message: 'Event closed', data: updated ?? undefined },
        { status: 200 }
      );
    }

    // General field update (title, description, date, time, location, capacity, registrationCutoff)
    await connectDB();
    const event = await Event.findOne({ _id: eventId, hostId: session.user.hostId });
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found or access denied' },
        { status: 404 }
      );
    }

    const allowedFields = [
      'title', 'description', 'date', 'time',
      'location', 'capacity', 'registrationCutoff',
    ] as const;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'date' || field === 'registrationCutoff') {
          event.set(field, new Date(body[field] as string));
        } else {
          event.set(field, body[field]);
        }
      }
    }

    await event.save();

    return NextResponse.json(
      { success: true, message: 'Event updated', data: event.toObject() as unknown as IEvent },
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

// DELETE /api/events/[eventId] — host auth
export async function DELETE(
  _request: Request,
  context: RouteContext
): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.hostId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventId } = await context.params;
    await deleteEvent(eventId, session.user.hostId);

    return NextResponse.json(
      { success: true, message: 'Event deleted' },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not found') || message.includes('permission') ? 404 : 500;
    return NextResponse.json(
      { success: false, message, error: message },
      { status }
    );
  }
}
