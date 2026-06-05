'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, Lock, Trash2, X } from 'lucide-react';
import type { IEvent } from '@/types/event.types';

interface EventCardProps {
  event: IEvent;
  showActions?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
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
    if (!confirm('Are you sure you want to close this event?')) return;
    try {
      const res = await fetch(`/api/events/${event._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isClosed: true }),
      });
      if (!res.ok) throw new Error('Failed to close event');
      toast.success('Event closed');
      onClose?.();
    } catch {
      toast.error('Failed to close event');
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this event and all its registrations? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/events/${event._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      toast.success('Event deleted');
      onDelete?.();
    } catch {
      toast.error('Failed to delete event');
    }
  };

  return (
    <Card
      onClick={() => router.push(`/events/${event.slug}`)}
      className="group cursor-pointer border-white/10 bg-zinc-900/60 transition-all hover:border-violet-500/30 hover:bg-zinc-900 hover:shadow-lg hover:shadow-violet-900/10"
    >
      <CardContent className="p-5">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base font-semibold text-white group-hover:text-violet-300 transition-colors">
            {event.title}
          </h3>
          {isClosed ? (
            <Badge variant="secondary" className="shrink-0 bg-zinc-700 text-zinc-400">
              Closed
            </Badge>
          ) : isFull ? (
            <Badge variant="secondary" className="shrink-0 bg-amber-900/50 text-amber-400">
              Full
            </Badge>
          ) : (
            <Badge className="shrink-0 bg-green-900/50 text-green-400 border-green-800/50">
              Open
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-zinc-400">{event.description}</p>

        {/* Meta */}
        <div className="space-y-1.5 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-violet-400 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-violet-400 shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-violet-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          {event.registrationCount !== undefined && (
            <div className="flex items-center gap-2">
              <Users size={14} className="text-violet-400 shrink-0" />
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
                className="border-white/10 text-zinc-400 hover:border-amber-500/50 hover:text-amber-400 text-xs"
              >
                <Lock size={12} className="mr-1" />
                Close
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="border-white/10 text-zinc-400 hover:border-red-500/50 hover:text-red-400 text-xs"
            >
              <Trash2 size={12} className="mr-1" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
