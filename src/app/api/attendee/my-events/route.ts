import { NextResponse } from 'next/server';
import { verifyAttendeeToken } from '@/lib/auth/attendee-jwt';
import {
  getAttendeeRegistrations,
  cancelRegistration,
} from '@/services/registration.service';
import type { ApiResponse } from '@/types/api.types';

// GET /api/attendee/my-events — attendee auth via cookie
export async function GET(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const payload = await verifyAttendeeToken(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: please log in' },
        { status: 401 }
      );
    }

    const registrations = await getAttendeeRegistrations(payload.attendeeId);

    return NextResponse.json(
      {
        success: true,
        message: 'Registrations fetched',
        data: registrations,
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

// DELETE /api/attendee/my-events?registrationId=xxx — attendee auth, cancel a registration
export async function DELETE(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const payload = await verifyAttendeeToken(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: please log in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('registrationId');

    if (!registrationId) {
      return NextResponse.json(
        { success: false, message: 'registrationId query param is required' },
        { status: 400 }
      );
    }

    await cancelRegistration(registrationId, payload.attendeeId);

    return NextResponse.json(
      { success: true, message: 'Registration cancelled' },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';

    if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('permission')) {
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
