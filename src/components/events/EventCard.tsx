'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Lock, Trash2 } from 'lucide-react';
import type { IEvent } from '@/types/event.types';

interface EventCardProps {
  event: IEvent;
  showActions?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function EventCard({ event, showActions = false, onClose, onDelete }: EventCardProps) {
  const router = useRouter();

  const isFull =
    event.capacity !== undefined &&
    event.registrationCount !== undefined &&
    event.registrationCount >= event.capacity;

  const isPastCutoff =
    event.registrationCutoff && new Date() > new Date(event.registrationCutoff);

  const isClosed = event.isClosed || isFull || !!isPastCutoff;

  const handleClose = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Close this event? Attendees will no longer be able to register.')) return;
    try {
      const res = await fetch(`/api/events/${event._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isClosed: true }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Event closed');
      onClose?.();
    } catch {
      toast.error('Failed to close event');
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this event and all registrations? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/events/${event._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Event deleted');
      onDelete?.();
    } catch {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div
      onClick={() => router.push(`/events/${event.slug}`)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/7 bg-[#111111] transition-all duration-250 hover:-translate-y-1 hover:border-violet-500/25 hover:shadow-xl hover:shadow-black/50"
    >
      {/* Top gradient accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(600px circle at 50% 0%, rgba(168,85,247,0.04), transparent 50%)' }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white transition-colors group-hover:text-violet-200">
            {event.title}
          </h3>

          {/* Status badge */}
          {event.isClosed ? (
            <Badge variant="secondary" className="shrink-0 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400 border-0">
              Closed
            </Badge>
          ) : isFull ? (
            <Badge variant="secondary" className="shrink-0 rounded-full bg-amber-500/12 px-2.5 py-0.5 text-xs text-amber-400 border border-amber-500/20">
              Full
            </Badge>
          ) : (
            <Badge className="shrink-0 rounded-full bg-green-500/12 px-2.5 py-0.5 text-xs text-green-400 border border-green-500/20">
              Open
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">
          {event.description}
        </p>

        {/* Meta */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Calendar size={12} className="shrink-0 text-violet-500" />
            <span>{formatDate(event.date)}</span>
            <span className="text-zinc-700">·</span>
            <Clock size={12} className="shrink-0 text-violet-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <MapPin size={12} className="shrink-0 text-violet-500" />
            <span className="truncate">{event.location}</span>
          </div>
          {event.registrationCount !== undefined && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Users size={12} className="shrink-0 text-violet-500" />
              <span>
                {event.registrationCount}
                {event.capacity ? ` / ${event.capacity}` : ''} registered
              </span>
            </div>
          )}
        </div>

        {/* Host actions */}
        {showActions && (
          <div className="mt-4 flex gap-2 border-t border-white/5 pt-4">
            {!event.isClosed && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="flex-1 border-white/8 bg-transparent text-xs text-zinc-500 transition-all hover:border-amber-500/30 hover:bg-amber-500/8 hover:text-amber-400"
              >
                <Lock size={11} className="mr-1.5" />
                Close
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="flex-1 border-white/8 bg-transparent text-xs text-zinc-500 transition-all hover:border-red-500/30 hover:bg-red-500/8 hover:text-red-400"
            >
              <Trash2 size={11} className="mr-1.5" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
