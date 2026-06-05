import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/nextauth';
import { getEventRegistrations } from '@/services/registration.service';
import type { ApiResponse } from '@/types/api.types';
import type { RegistrationRow } from '@/types/api.types';

interface RouteContext {
  params: Promise<{ eventId: string }>;
}

// GET /api/events/[eventId]/registrations — host auth only
export async function GET(
  _request: Request,
  context: RouteContext
): Promise<NextResponse<ApiResponse<RegistrationRow[]>>> {
  try {
    const session = await auth();
    if (!session?.user?.hostId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventId } = await context.params;

    const registrations = await getEventRegistrations(eventId, session.user.hostId);

    return NextResponse.json(
      {
        success: true,
        message: 'Registrations fetched',
        data: registrations, // only { name, email, registeredAt } — no passwords
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';

    if (message.toLowerCase().includes('not authorized')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: you do not own this event', error: message },
        { status: 403 }
      );
    }

    if (message.toLowerCase().includes('not found')) {
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
