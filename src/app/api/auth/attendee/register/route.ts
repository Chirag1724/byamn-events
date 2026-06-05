import { NextResponse } from 'next/server';
import { createAttendee } from '@/services/attendee.service';
import { registerAttendeeSchema } from '@/validators/attendee.validator';
import type { ApiResponse } from '@/types/api.types';
import type { IAttendee } from '@/types/attendee.types';

export async function POST(request: Request): Promise<NextResponse<ApiResponse<IAttendee>>> {
  try {
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

    const attendee = await createAttendee(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: 'Registered successfully',
        data: attendee,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';

    if (message.toLowerCase().includes('already exists')) {
      return NextResponse.json(
        { success: false, message: 'Email already registered', error: message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error', error: message },
      { status: 500 }
    );
  }
}
