import Link from 'next/link';
import connectDB from '@/lib/db/mongodb';
import Event from '@/models/Event.model';
import Registration from '@/models/Registration.model';
import { Navbar } from '@/components/shared/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Search } from 'lucide-react';
import type { IEvent } from '@/types/event.types';

export const metadata = {
  title: 'Browse Events — Byamn Events',
  description: 'Discover upcoming events and register to attend.',
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default async function BrowseEventsPage() {
  await connectDB();

  const rawEvents = await Event.find()
    .sort({ date: 1 })
    .lean();

  const events = await Promise.all(
    rawEvents.map(async (e) => {
      const count = await Registration.countDocuments({ eventId: e._id });
      return { ...(e as unknown as IEvent), registrationCount: count };
    })
  );

  const open = events.filter((e) => !e.isClosed);
  const closed = events.filter((e) => e.isClosed);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white">Browse Events</h1>
          <p className="mt-2 text-zinc-400">Find events to attend and register directly.</p>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <Search size={40} className="text-zinc-600" />
            <h2 className="text-xl font-semibold text-white">No events yet</h2>
            <p className="text-zinc-400 text-sm">Check back soon or host your own event.</p>
            <Button asChild className="bg-violet-600 text-white hover:bg-violet-500">
              <Link href="/host/register">Host an event</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Open events */}
            {open.length > 0 && (
              <section>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                  Open for Registration
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {open.map((event) => {
                    const isFull =
                      event.capacity !== undefined &&
                      event.registrationCount !== undefined &&
                      event.registrationCount >= event.capacity;

                    return (
                      <Link
                        key={event._id}
                        href={`/events/${event.slug}`}
                        className="group block rounded-xl border border-white/10 bg-zinc-900/60 p-5 transition-all hover:border-violet-500/30 hover:bg-zinc-900"
                      >
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 text-base font-semibold text-white group-hover:text-violet-300 transition-colors">
                            {event.title}
                          </h3>
                          {isFull ? (
                            <Badge variant="secondary" className="shrink-0 bg-amber-900/50 text-amber-400 text-xs">Full</Badge>
                          ) : (
                            <Badge className="shrink-0 bg-green-900/50 text-green-400 border-green-800/50 text-xs">Open</Badge>
                          )}
                        </div>
                        <p className="mb-3 line-clamp-2 text-sm text-zinc-400">{event.description}</p>
                        <div className="space-y-1.5 text-xs text-zinc-500">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-violet-400" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={12} className="text-violet-400" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-violet-400" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          {event.registrationCount !== undefined && (
                            <div className="flex items-center gap-2">
                              <Users size={12} className="text-violet-400" />
                              <span>
                                {event.registrationCount}
                                {event.capacity ? ` / ${event.capacity}` : ''} registered
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Closed events */}
            {closed.length > 0 && (
              <section className="opacity-60">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-600">
                  Past / Closed Events
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {closed.map((event) => (
                    <Link
                      key={event._id}
                      href={`/events/${event.slug}`}
                      className="block rounded-xl border border-white/5 bg-zinc-900/30 p-5 transition-all hover:bg-zinc-900/50"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="line-clamp-1 text-sm font-semibold text-zinc-400">{event.title}</h3>
                        <Badge variant="secondary" className="shrink-0 bg-zinc-800 text-zinc-500 text-xs">Closed</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <Calendar size={12} />
                        <span>{formatDate(event.date)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
