'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Calendar, Clock, MapPin, Trash2, CalendarDays, Ticket, ArrowRight, Loader2 } from 'lucide-react';

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

function formatRegisteredAt(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
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
    <div className="min-h-screen bg-[#080808]">
      {/* Page header */}
      <div className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/12 ring-1 ring-violet-500/20">
              <Ticket size={18} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">My Events</h1>
              <p className="text-xs text-zinc-600">Your registered events</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {loading ? (
          <LoadingSpinner size={32} className="py-28" />
        ) : registrations.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-5 py-28 text-center animate-fade-up">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
              <CalendarDays size={26} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">No events yet</h2>
              <p className="mt-1 max-w-xs text-sm text-zinc-500">
                You haven&apos;t registered for any events. Browse available events to get started.
              </p>
            </div>
            <Button
              asChild
              className="bg-violet-600 text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500 hover:-translate-y-px transition-all"
            >
              <Link href="/events">
                Browse Events
                <ArrowRight size={15} className="ml-1.5" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Count label */}
            <p className="mb-5 text-xs text-zinc-700">
              {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
            </p>

            {registrations.map((reg) => {
              const event = reg.eventId;
              const isCancelling = cancelling === reg._id;

              return (
                <div
                  key={reg._id}
                  className="group relative overflow-hidden rounded-xl border border-white/7 bg-[#111111] p-5 transition-all hover:border-white/12"
                  style={{ opacity: isCancelling ? 0.5 : 1, transition: 'opacity 300ms ease' }}
                >
                  {/* Top accent on hover */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      {/* Badge row */}
                      <div className="mb-2 flex items-center gap-2">
                        {event.isClosed ? (
                          <Badge className="rounded-full border-0 bg-zinc-800 px-2.5 text-xs text-zinc-500">
                            Closed
                          </Badge>
                        ) : (
                          <Badge className="rounded-full border border-green-500/20 bg-green-500/10 px-2.5 text-xs text-green-400">
                            Open
                          </Badge>
                        )}
                        <span className="text-xs text-zinc-700">
                          Registered {formatRegisteredAt(reg.registeredAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <Link
                        href={`/events/${event.slug}`}
                        className="block truncate text-[15px] font-semibold text-white transition-colors hover:text-violet-300"
                      >
                        {event.title}
                      </Link>

                      {/* Meta */}
                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} className="text-violet-500" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={11} className="text-violet-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={11} className="text-violet-500" />
                          <span className="truncate max-w-[180px]">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cancel button */}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isCancelling}
                      onClick={() => handleCancel(reg._id)}
                      className="shrink-0 border-white/8 bg-transparent text-xs text-zinc-600 transition-all hover:border-red-500/30 hover:bg-red-500/6 hover:text-red-400 disabled:opacity-40"
                    >
                      {isCancelling ? (
                        <Loader2 size={12} className="mr-1 animate-spin" />
                      ) : (
                        <Trash2 size={12} className="mr-1" />
                      )}
                      {isCancelling ? 'Cancelling…' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
