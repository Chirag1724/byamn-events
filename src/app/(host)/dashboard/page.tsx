'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { EventCard } from '@/components/events/EventCard';
import { RegistrationsTable } from '@/components/dashboard/RegistrationsTable';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Plus, CalendarDays, Users } from 'lucide-react';
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
      if (json.success) {
        setEvents(json.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const res = await fetch('/api/auth/session');
      const data = (await res.json()) as { user?: { hostId?: string } };
      if (data?.user?.hostId) {
        setHostId(data.user.hostId);
      }
    };
    void getSession();
    void loadEvents();
  }, [loadEvents]);

  const hostEvents = hostId
    ? events.filter((e) => e.hostId === hostId)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="mt-1 text-zinc-400">Manage your events and attendees</p>
        </div>
        <Button
          asChild
          className="bg-violet-600 text-white hover:bg-violet-500 font-semibold shrink-0"
        >
          <Link href="/events/create">
            <Plus size={16} className="mr-1.5" />
            New Event
          </Link>
        </Button>
      </div>

      {/* Stats bar */}
      {!loading && (
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-4 py-2.5">
            <CalendarDays size={16} className="text-violet-400" />
            <span className="text-sm text-zinc-300">
              <span className="font-semibold text-white">{hostEvents.length}</span> event{hostEvents.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-4 py-2.5">
            <Users size={16} className="text-violet-400" />
            <span className="text-sm text-zinc-300">
              <span className="font-semibold text-white">
                {hostEvents.reduce((sum, e) => sum + (e.registrationCount ?? 0), 0)}
              </span> total registrations
            </span>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner size={32} className="py-24" />
      ) : hostEvents.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
            <CalendarDays size={28} className="text-violet-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">No events yet</h2>
          <p className="max-w-sm text-zinc-400 text-sm">
            Create your first event and start accepting registrations.
          </p>
          <Button asChild className="bg-violet-600 text-white hover:bg-violet-500">
            <Link href="/events/create">
              <Plus size={16} className="mr-1.5" />
              Create your first event
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {hostEvents.map((event) => (
            <div key={event._id} className="relative">
              <EventCard
                event={event}
                showActions
                onClose={loadEvents}
                onDelete={loadEvents}
              />
              {/* Registrations quick-view button */}
              <div className="mt-1 px-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(event)}
                  className="w-full text-xs text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 h-7"
                >
                  <Users size={11} className="mr-1.5" />
                  View Registrations
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registrations Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl border-white/10 bg-zinc-900 text-white w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center justify-between pr-6">
              <span className="truncate">{selectedEvent?.title}</span>
              {selectedEvent && (
                <ExportButton eventId={selectedEvent._id} />
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Registrations for {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto">
              <RegistrationsTable eventId={selectedEvent._id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
