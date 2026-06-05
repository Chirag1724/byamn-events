import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarDays, Search, ArrowRight, Ticket } from 'lucide-react';

export default function AttendeeRegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-4 py-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 w-full max-w-md animate-fade-up text-center">
        {/* Brand */}
        <Link href="/" className="mb-10 flex items-center justify-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30 transition-all group-hover:ring-violet-500/50">
            <CalendarDays size={18} className="text-violet-400" />
          </div>
          <span className="text-lg font-semibold text-white">
            Byamn <span className="font-normal text-zinc-500">Events</span>
          </span>
        </Link>

        {/* Card */}
        <div className="glass gradient-border rounded-2xl p-10">
          {/* Icon */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/12 ring-1 ring-violet-500/20 mx-auto">
            <Ticket size={28} className="text-violet-400" />
          </div>

          <h1 className="mb-3 text-2xl font-bold text-white">Register for events</h1>
          <p className="mb-8 text-sm leading-relaxed text-zinc-500 max-w-xs mx-auto">
            Attendee accounts are created automatically when you register for an event. Browse events and sign up directly from the event page — no pre-registration needed.
          </p>

          <Button
            asChild
            size="lg"
            className="h-11 w-full bg-violet-600 font-semibold text-white shadow-lg shadow-violet-900/30 transition-all hover:bg-violet-500 hover:-translate-y-0.5"
          >
            <Link href="/events">
              <Search size={16} className="mr-2" />
              Browse Events
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>

          <div className="mt-6 border-t border-white/6 pt-5 text-sm text-zinc-600">
            Already registered for an event?{' '}
            <Link href="/attendee/login" className="text-violet-400 hover:text-violet-300 transition-colors">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
