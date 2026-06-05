import { NextResponse } from 'next/server';
import { registerForEvent } from '@/services/registration.service';
import { registerAttendeeSchema } from '@/validators/attendee.validator';
import type { ApiResponse } from '@/types/api.types';
import type { RegistrationRow } from '@/types/api.types';

interface RouteContext {
  params: Promise<{ eventId: string }>;
}

const CLOSED_ERRORS = [
  'event is closed',
  'event is full',
  'registration deadline has passed',
  'registration closed',
];

// POST /api/events/[eventId]/register — public, no auth required
export async function POST(
  request: Request,
  context: RouteContext
): Promise<NextResponse<ApiResponse<RegistrationRow>>> {
  try {
    const { eventId } = await context.params;

    const body: unknown = await request.json();
    const parsed = registerAttendeeSchema.safeParse(body);

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

    const registration = await registerForEvent(eventId, parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: 'Registered for event successfully',
        data: registration,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('already registered')) {
      return NextResponse.json(
        { success: false, message, error: message },
        { status: 409 }
      );
    }

    if (CLOSED_ERRORS.some((e) => lowerMsg.includes(e))) {
      return NextResponse.json(
        { success: false, message, error: message },
        { status: 400 }
      );
    }

    if (lowerMsg.includes('not found')) {
      return NextResponse.json(
        { success: false, message, error: message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error', error: message },
      { status: 500 }
    );
  }
}
