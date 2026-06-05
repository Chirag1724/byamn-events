'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarDays, LayoutDashboard, LogOut, LogIn, UserPlus, Ticket } from 'lucide-react';

export function Navbar() {
  const { data: session, status } = useSession();
  const isHost = status === 'authenticated' && !!session?.user?.hostId;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/8 bg-black/80 shadow-lg shadow-black/30 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-15 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 ring-1 ring-violet-500/30 transition-all group-hover:bg-violet-500/20 group-hover:ring-violet-500/50">
            <CalendarDays size={16} className="text-violet-400" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Byamn <span className="text-zinc-400 font-normal">Events</span>
          </span>
        </Link>

        {/* Nav actions */}
        <nav className="flex items-center gap-1.5">
          {/* Browse events link — always visible */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-zinc-400 hover:bg-white/5 hover:text-white sm:flex"
          >
            <Link href="/events">
              <Ticket size={15} className="mr-1.5 opacity-70" />
              Browse
            </Link>
          </Button>

          {isHost ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <Link href="/dashboard">
                  <LayoutDashboard size={15} className="mr-1.5 opacity-70" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="border-white/10 bg-white/3 text-zinc-400 hover:border-white/20 hover:bg-white/7 hover:text-white"
              >
                <LogOut size={14} className="mr-1.5 opacity-70" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <Link href="/host/login">
                  <LogIn size={15} className="mr-1.5 opacity-70" />
                  <span className="hidden sm:inline">Host Login</span>
                  <span className="sm:hidden">Login</span>
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-violet-600 text-white shadow-md shadow-violet-900/30 transition-all hover:bg-violet-500 hover:shadow-violet-800/40 hover:-translate-y-px active:translate-y-0"
              >
                <Link href="/attendee/login">
                  <UserPlus size={14} className="mr-1.5" />
                  <span className="hidden sm:inline">Attendee Login</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
