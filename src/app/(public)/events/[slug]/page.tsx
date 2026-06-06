import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/services/event.service';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { RegistrationForm } from '@/components/events/RegistrationForm';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, AlertTriangle, Lock } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found' };
  return {
    title: `${event.title} — Byamn Events`,
    description: event.description,
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const isFull =
    event.capacity !== undefined && event.registrationCount !== undefined &&
    event.registrationCount >= event.capacity;

  const isPastCutoff =
    event.registrationCutoff && new Date() > new Date(event.registrationCutoff);

  const registrationClosed = event.isClosed || isFull || !!isPastCutoff;

  const closedReason = event.isClosed
    ? 'This event has been closed by the host.'
    : isFull
    ? 'This event has reached its maximum capacity.'
    : isPastCutoff
    ? 'The registration deadline has passed.'
    : null;

  const pct =
    event.capacity && event.registrationCount !== undefined
      ? Math.min(100, Math.round((event.registrationCount / event.capacity) * 100))
      : null;

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />

      {/* Hero strip */}
      <div className="relative overflow-hidden border-b border-white/5 bg-[#0a0a0a]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/3 h-[300px] w-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          {/* Status badge */}
          <div className="mb-4">
            {registrationClosed ? (
              <Badge className="rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-400">
                <Lock size={10} className="mr-1.5" />
                Registration Closed
              </Badge>
            ) : (
              <Badge className="rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                Open for Registration
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">

          {/* ── Event Details ── left */}
          <div className="lg:col-span-3">
            {/* Meta info cards */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-white/7 bg-[#111111] px-4 py-3.5">
                <Calendar size={16} className="shrink-0 text-violet-400" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-600">Date</div>
                  <div className="mt-0.5 text-sm font-medium text-zinc-200">{formatDate(event.date)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/7 bg-[#111111] px-4 py-3.5">
                <Clock size={16} className="shrink-0 text-violet-400" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-600">Time</div>
                  <div className="mt-0.5 text-sm font-medium text-zinc-200">{event.time}</div>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-3 rounded-xl border border-white/7 bg-[#111111] px-4 py-3.5">
                <MapPin size={16} className="shrink-0 text-violet-400" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-600">Location</div>
                  <div className="mt-0.5 text-sm font-medium text-zinc-200">{event.location}</div>
                </div>
              </div>
            </div>

            {/* Attendee count + capacity bar */}
            {event.registrationCount !== undefined && (
              <div className="mb-8 rounded-xl border border-white/7 bg-[#111111] px-4 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Users size={14} className="text-violet-400" />
                    <span>
                      <span className="font-semibold text-white">{event.registrationCount}</span>
                      {event.capacity ? (
                        <span className="text-zinc-600"> / {event.capacity} spots</span>
                      ) : (
                        <span className="text-zinc-600"> registered</span>
                      )}
                    </span>
                  </div>
                  {pct !== null && (
                    <span className="text-xs text-zinc-600">{pct}% full</span>
                  )}
                </div>
                {pct !== null && (
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="rounded-xl border border-white/7 bg-[#111111] px-5 py-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">
                About this event
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {event.description}
              </p>
            </div>
          </div>

          {/* ── Registration panel ── right */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 rounded-xl border border-white/8 bg-[#111111] p-6">
              {registrationClosed ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/20">
                    <AlertTriangle size={22} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Registration Closed</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{closedReason}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2 className="text-base font-semibold text-white">Register for this event</h2>
                    <p className="mt-1 text-xs text-zinc-600">
                      Your account will be created automatically
                    </p>
                  </div>
                  <RegistrationForm
                    eventId={String(event._id as unknown as { toString(): string })}
                  />
                </>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
