import Link from 'next/link';
import connectDB from '@/lib/db/mongodb';
import Event from '@/models/Event.model';
import Registration from '@/models/Registration.model';
import { Navbar } from '@/components/shared/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Search, ArrowRight, Sparkles } from 'lucide-react';
import type { IEvent } from '@/types/event.types';

// Force this page to render at request time (not statically at build time)
export const dynamic = 'force-dynamic';

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

  const rawEvents = await Event.find().sort({ date: 1 }).lean();

  const events = await Promise.all(
    rawEvents.map(async (e) => {
      const count = await Registration.countDocuments({ eventId: e._id });
      return { ...(e as unknown as IEvent), registrationCount: count };
    })
  );

  const open = events.filter((e) => !e.isClosed);
  const closed = events.filter((e) => e.isClosed);

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />

      {/* Page header */}
      <div className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-violet-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Discover</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Browse Events
              </h1>
              <p className="mt-1.5 text-sm text-zinc-500">
                {events.length > 0
                  ? `${open.length} open · ${closed.length} closed`
                  : 'No events yet — be the first to host one'}
              </p>
            </div>
            <Button
              asChild
              size="sm"
              className="shrink-0 bg-violet-600 text-white shadow-md shadow-violet-900/30 hover:bg-violet-500 hover:-translate-y-px transition-all"
            >
              <Link href="/host/register">
                Host an Event
                <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {events.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-5 py-28 text-center animate-fade-up">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 ring-1 ring-white/8">
              <Search size={24} className="text-zinc-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">No events yet</h2>
              <p className="mt-1 text-sm text-zinc-500">Check back soon or host your own event.</p>
            </div>
            <Button asChild className="bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-900/30 hover:-translate-y-px transition-all">
              <Link href="/host/register">Host an Event</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Open events */}
            {open.length > 0 && (
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Open for Registration
                  </h2>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-500">
                    {open.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {open.map((event) => {
                    const isFull =
                      event.capacity !== undefined &&
                      event.registrationCount !== undefined &&
                      event.registrationCount >= event.capacity;

                    return (
                      <Link
                        key={String(event._id)}
                        href={`/events/${event.slug}`}
                        className="group relative overflow-hidden rounded-xl border border-white/7 bg-[#111111] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-500/25 hover:shadow-lg hover:shadow-black/40"
                      >
                        {/* Top accent */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                        <div className="mb-3 flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white transition-colors group-hover:text-violet-200">
                            {event.title}
                          </h3>
                          {isFull ? (
                            <Badge className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 text-xs text-amber-400">
                              Full
                            </Badge>
                          ) : (
                            <Badge className="shrink-0 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 text-xs text-green-400">
                              Open
                            </Badge>
                          )}
                        </div>

                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                          {event.description}
                        </p>

                        <div className="space-y-1.5 text-xs text-zinc-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={11} className="text-violet-500" />
                            <span>{formatDate(event.date)}</span>
                            <span className="text-zinc-800">·</span>
                            <Clock size={11} className="text-violet-500" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={11} className="text-violet-500" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          {event.registrationCount !== undefined && (
                            <div className="flex items-center gap-2">
                              <Users size={11} className="text-violet-500" />
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
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                    Past / Closed
                  </h2>
                  <span className="rounded-full bg-white/4 px-2 py-0.5 text-xs text-zinc-700">
                    {closed.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 opacity-50">
                  {closed.map((event) => (
                    <Link
                      key={String(event._id)}
                      href={`/events/${event.slug}`}
                      className="block rounded-xl border border-white/5 bg-[#0d0d0d] p-4 transition-all hover:bg-[#121212]"
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <h3 className="line-clamp-1 text-sm font-medium text-zinc-400">{event.title}</h3>
                        <Badge className="shrink-0 rounded-full border-0 bg-zinc-800 px-2.5 text-xs text-zinc-600">
                          Closed
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-700">
                        <Calendar size={10} />
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
