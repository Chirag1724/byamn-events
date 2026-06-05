import { NextResponse } from 'next/server';
import { findAttendeeByEmail } from '@/services/attendee.service';
import { comparePassword } from '@/lib/utils/hash';
import { signAttendeeToken } from '@/lib/auth/attendee-jwt';
import { loginAttendeeSchema } from '@/validators/attendee.validator';
import type { ApiResponse } from '@/types/api.types';

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

export async function POST(request: Request): Promise<NextResponse<ApiResponse<{ name: string; email: string }>>> {
  try {
    const body: unknown = await request.json();
    const parsed = loginAttendeeSchema.safeParse(body);

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

    const { email, password } = parsed.data;

    const attendee = await findAttendeeByEmail(email);
    if (!attendee) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const storedPassword = attendee.get('password', null, { getters: false }) as string | null;
    if (!storedPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, storedPassword);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const attendeeId = (attendee._id as { toString(): string }).toString();
    const token = await signAttendeeToken({ attendeeId, email: attendee.email as string });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          name: attendee.name as string,
          email: attendee.email as string,
        },
      },
      { status: 200 }
    );

    response.cookies.set('attendee_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SEVEN_DAYS_SECONDS,
      path: '/',
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: message },
      { status: 500 }
    );
  }
}
