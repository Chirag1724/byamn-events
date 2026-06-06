import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080808] py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 ring-1 ring-violet-500/25 transition-all group-hover:ring-violet-500/50">
              <CalendarDays size={14} className="text-violet-400" />
            </div>
            <span className="text-sm font-semibold text-white">
              Byamn <span className="font-normal text-zinc-500">Events</span>
            </span>
          </Link>

          {/* Quick links */}
          <nav className="flex items-center gap-5 text-sm text-zinc-600">
            <Link href="/events" className="transition-colors hover:text-zinc-300">Browse Events</Link>
            <Link href="/host/register" className="transition-colors hover:text-zinc-300">Host an Event</Link>
            <Link href="/attendee/login" className="transition-colors hover:text-zinc-300">My Events</Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} Byamn Events
          </p>
        </div>
      </div>
    </footer>
  );
}
