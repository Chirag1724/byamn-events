import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth/nextauth';
import connectDB from '@/lib/db/mongodb';
import Event from '@/models/Event.model';
import { RegistrationsTable } from '@/components/dashboard/RegistrationsTable';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import type { IEvent } from '@/types/event.types';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function HostEventPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.hostId) redirect('/host/login');

  const { eventId } = await params;
  await connectDB();

  const raw = await Event.findOne({ _id: eventId, hostId: session.user.hostId }).lean();
  if (!raw) notFound();

  const event = raw as unknown as IEvent;

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="mb-6 text-zinc-400 hover:text-white">
        <Link href="/dashboard">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to dashboard
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            {event.isClosed ? (
              <Badge variant="secondary" className="bg-zinc-700 text-zinc-400">Closed</Badge>
            ) : (
              <Badge className="bg-green-900/50 text-green-400 border-green-800/50">Open</Badge>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-white truncate">{event.title}</h1>
        </div>
        <ExportButton eventId={eventId} />
      </div>

      {/* Meta */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-violet-400" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-violet-400" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-violet-400" />
          <span>{event.location}</span>
        </div>
        {event.capacity && (
          <div className="flex items-center gap-2">
            <Users size={15} className="text-violet-400" />
            <span>Capacity: {event.capacity}</span>
          </div>
        )}
      </div>

      <p className="mb-8 rounded-lg border border-white/5 bg-zinc-900/40 p-4 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
        {event.description}
      </p>

      <Separator className="mb-8 bg-white/10" />

      {/* Registrations */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Registrations</h2>
      </div>
      <RegistrationsTable eventId={eventId} />
    </div>
  );
}
