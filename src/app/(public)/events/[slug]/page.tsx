import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/services/event.service';
import { Navbar } from '@/components/shared/Navbar';
import { RegistrationForm } from '@/components/events/RegistrationForm';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, Users, AlertTriangle } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Event Details — left */}
          <div className="lg:col-span-3">
            {/* Status badge */}
            <div className="mb-4">
              {registrationClosed ? (
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-400">
                  Registration Closed
                </Badge>
              ) : (
                <Badge className="bg-green-900/50 text-green-400 border-green-800/50">
                  Open for Registration
                </Badge>
              )}
            </div>

            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {event.title}
            </h1>

            <div className="mb-6 space-y-3 text-zinc-400">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-violet-400 shrink-0" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-violet-400 shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-violet-400 shrink-0" />
                <span>{event.location}</span>
              </div>
              {event.registrationCount !== undefined && (
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-violet-400 shrink-0" />
                  <span>
                    {event.registrationCount}
                    {event.capacity ? ` / ${event.capacity}` : ''} registered
                  </span>
                </div>
              )}
            </div>

            <Separator className="mb-6 bg-white/10" />

            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>

          {/* Registration panel — right */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-sm">
              {registrationClosed ? (
                <div className="flex flex-col items-center gap-3 text-center py-4">
                  <AlertTriangle size={32} className="text-amber-400" />
                  <h3 className="font-semibold text-white">Registration Closed</h3>
                  <p className="text-sm text-zinc-400">{closedReason}</p>
                </div>
              ) : (
                <>
                  <h2 className="mb-5 text-lg font-semibold text-white">Register for this event</h2>
                  <RegistrationForm eventId={String(event._id as unknown as { toString(): string })} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
