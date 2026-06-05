'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { EventCard } from '@/components/events/EventCard';
import { RegistrationsTable } from '@/components/dashboard/RegistrationsTable';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Plus, CalendarDays, Users, LayoutDashboard } from 'lucide-react';
import type { IEvent } from '@/types/event.types';

interface ApiEventsResponse {
  success: boolean;
  data: IEvent[];
}

export default function DashboardPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [hostId, setHostId] = useState<string>('');

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const json = (await res.json()) as ApiEventsResponse;
      if (json.success) setEvents(json.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const res = await fetch('/api/auth/session');
      const data = (await res.json()) as { user?: { hostId?: string } };
      if (data?.user?.hostId) setHostId(data.user.hostId);
    };
    void getSession();
    void loadEvents();
  }, [loadEvents]);

  const hostEvents = hostId ? events.filter((e) => e.hostId === hostId) : [];
  const totalRegistrations = hostEvents.reduce((sum, e) => sum + (e.registrationCount ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── Page header ── */}
      <div className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/12 ring-1 ring-violet-500/20">
                <LayoutDashboard size={18} className="text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <p className="text-xs text-zinc-600">Manage your events and attendees</p>
              </div>
            </div>
            <Button
              asChild
              className="shrink-0 bg-violet-600 font-semibold text-white shadow-md shadow-violet-900/30 transition-all hover:bg-violet-500 hover:-translate-y-px"
            >
              <Link href="/events/create">
                <Plus size={16} className="mr-1.5" />
                New Event
              </Link>
            </Button>
          </div>

          {/* Stats bar */}
          {!loading && (
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2.5 rounded-lg border border-white/7 bg-[#111111] px-4 py-2.5">
                <CalendarDays size={15} className="text-violet-400" />
                <span className="text-sm text-zinc-500">
                  <span className="font-semibold text-white">{hostEvents.length}</span>{' '}
                  event{hostEvents.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-white/7 bg-[#111111] px-4 py-2.5">
                <Users size={15} className="text-violet-400" />
                <span className="text-sm text-zinc-500">
                  <span className="font-semibold text-white">{totalRegistrations}</span>{' '}
                  total registrations
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {loading ? (
          <LoadingSpinner size={32} className="py-28" />
        ) : hostEvents.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-5 py-28 text-center animate-fade-up">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
              <CalendarDays size={26} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">No events yet</h2>
              <p className="mt-1 max-w-xs text-sm text-zinc-500">
                Create your first event and start accepting registrations.
              </p>
            </div>
            <Button
              asChild
              className="bg-violet-600 text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500 hover:-translate-y-px transition-all"
            >
              <Link href="/events/create">
                <Plus size={16} className="mr-1.5" />
                Create your first event
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {hostEvents.map((event) => (
              <div key={event._id} className="flex flex-col gap-1">
                <EventCard
                  event={event}
                  showActions
                  onClose={loadEvents}
                  onDelete={loadEvents}
                />
                {/* View registrations button below card */}
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-white/5 bg-transparent text-xs text-zinc-600 transition-all hover:border-violet-500/20 hover:bg-violet-500/6 hover:text-violet-400"
                >
                  <Users size={11} />
                  View Registrations
                  {event.registrationCount != null && event.registrationCount > 0 && (
                    <span className="ml-1 rounded-full bg-violet-500/15 px-1.5 py-px text-[10px] text-violet-400">
                      {event.registrationCount}
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Registrations Dialog ── */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="w-[95vw] max-w-3xl border-white/8 bg-[#111111] p-0 text-white">
          <DialogHeader className="border-b border-white/7 px-6 py-5">
            <div className="flex items-center justify-between gap-4 pr-12">
              <div className="min-w-0">
                <DialogTitle className="truncate text-base font-semibold text-white">
                  {selectedEvent?.title}
                </DialogTitle>
                <p className="mt-0.5 text-xs text-zinc-600">Registered attendees</p>
              </div>
              {selectedEvent && <ExportButton eventId={selectedEvent._id} />}
            </div>
            <DialogDescription className="sr-only">
              Registrations for {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              <RegistrationsTable eventId={selectedEvent._id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
