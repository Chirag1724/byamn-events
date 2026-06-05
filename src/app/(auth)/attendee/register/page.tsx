import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarDays, Search } from 'lucide-react';

export default function AttendeeRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex items-center justify-center gap-2 text-xl font-bold text-white">
          <CalendarDays size={24} className="text-violet-400" />
          Byamn Events
        </div>
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-500/30 mx-auto">
          <Search size={28} className="text-violet-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Register for events</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Attendee accounts are created automatically when you register for an event.
          Browse events and sign up directly from the event page.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-violet-600 text-white hover:bg-violet-500 font-semibold"
        >
          <Link href="/events">Browse Events →</Link>
        </Button>
        <p className="mt-6 text-sm text-zinc-500">
          Already registered?{' '}
          <Link href="/attendee/login" className="text-violet-400 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
