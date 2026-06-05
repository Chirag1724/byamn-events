import { NextResponse } from 'next/server';
import { createHost } from '@/services/host.service';
import { registerHostSchema } from '@/validators/host.validator';
import type { ApiResponse } from '@/types/api.types';
import type { IHost } from '@/types/host.types';

export async function POST(request: Request): Promise<NextResponse<ApiResponse<IHost>>> {
  try {
    const body: unknown = await request.json();
    const parsed = registerHostSchema.safeParse(body);

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

    const host = await createHost(parsed.data);

    return NextResponse.json(
      { success: true, message: 'Host registered successfully', data: host },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';

    if (message.toLowerCase().includes('email already exists')) {
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
