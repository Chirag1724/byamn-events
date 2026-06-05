import { auth } from '@/lib/auth/nextauth';
import { exportRegistrationsCSV } from '@/services/registration.service';

interface RouteContext {
  params: Promise<{ eventId: string }>;
}

// GET /api/events/[eventId]/export — host auth only, returns CSV file download
export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.hostId) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { eventId } = await context.params;

    const csv = await exportRegistrationsCSV(eventId, session.user.hostId);

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="registrations-${eventId}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';

    if (message.toLowerCase().includes('not authorized')) {
      return new Response(
        JSON.stringify({ success: false, message: 'Forbidden: you do not own this event' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (message.toLowerCase().includes('not found')) {
      return new Response(
        JSON.stringify({ success: false, message }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error', error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
