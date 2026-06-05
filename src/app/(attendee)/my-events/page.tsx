'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Calendar, Clock, MapPin, Trash2, CalendarDays } from 'lucide-react';

interface PopulatedEvent {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  slug: string;
  isClosed: boolean;
}

interface AttendeeRegistration {
  _id: string;
  eventId: PopulatedEvent;
  name: string;
  email: string;
  registeredAt: string;
}

interface ApiResponse {
  success: boolean;
  data: AttendeeRegistration[];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState<AttendeeRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/attendee/my-events');
      if (!res.ok) return;
      const json = (await res.json()) as ApiResponse;
      if (json.success) setRegistrations(json.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRegistrations();
  }, [loadRegistrations]);

  const handleCancel = async (registrationId: string) => {
    if (!confirm('Cancel this registration? This cannot be undone.')) return;
    setCancelling(registrationId);
    try {
      const res = await fetch(
        `/api/attendee/my-events?registrationId=${registrationId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) {
        toast.error('Failed to cancel registration');
        return;
      }
      toast.success('Registration cancelled');
      setRegistrations((prev) => prev.filter((r) => r._id !== registrationId));
    } catch {
      toast.error('Something went wrong');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">My Events</h1>
        <p className="mt-1 text-zinc-400">Your registered events</p>
      </div>

      {loading ? (
        <LoadingSpinner size={32} className="py-24" />
      ) : registrations.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
            <CalendarDays size={28} className="text-violet-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">No events yet</h2>
          <p className="max-w-sm text-sm text-zinc-400">
            You haven&apos;t registered for any events. Browse available events to get started.
          </p>
          <Button asChild className="bg-violet-600 text-white hover:bg-violet-500">
            <Link href="/events">Browse Events →</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const event = reg.eventId;
            return (
              <div
                key={reg._id}
                className="group rounded-xl border border-white/10 bg-zinc-900/60 p-5 transition-all hover:border-violet-500/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      {event.isClosed ? (
                        <Badge variant="secondary" className="bg-zinc-700 text-zinc-400 text-xs">
                          Closed
                        </Badge>
                      ) : (
                        <Badge className="bg-green-900/50 text-green-400 border-green-800/50 text-xs">
                          Open
                        </Badge>
                      )}
                    </div>
                    <Link
                      href={`/events/${event.slug}`}
                      className="block text-lg font-semibold text-white hover:text-violet-300 transition-colors truncate"
                    >
                      {event.title}
                    </Link>
                    <div className="mt-2 space-y-1.5 text-sm text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-violet-400 shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-violet-400 shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-violet-400 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={cancelling === reg._id}
                    onClick={() => handleCancel(reg._id)}
                    className="shrink-0 border-white/10 text-zinc-500 hover:border-red-500/40 hover:text-red-400 text-xs"
                  >
                    <Trash2 size={12} className="mr-1" />
                    {cancelling === reg._id ? 'Cancelling…' : 'Cancel'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
