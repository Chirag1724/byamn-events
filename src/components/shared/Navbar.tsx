'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { CalendarDays, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';

export function Navbar() {
  const { data: session, status } = useSession();
  const isHost = status === 'authenticated' && !!session?.user?.hostId;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-white transition-opacity hover:opacity-80"
        >
          <CalendarDays size={22} className="text-violet-400" />
          <span>Byamn Events</span>
        </Link>

        {/* Nav actions */}
        <nav className="flex items-center gap-2">
          {isHost ? (
            <>
              <Button asChild variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
                <Link href="/dashboard">
                  <LayoutDashboard size={16} className="mr-1.5" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="border-white/20 text-zinc-300 hover:border-white/40 hover:text-white"
              >
                <LogOut size={16} className="mr-1.5" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
                <Link href="/host/login">
                  <LogIn size={16} className="mr-1.5" />
                  Host Login
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-violet-600 text-white hover:bg-violet-500"
              >
                <Link href="/attendee/login">
                  <UserPlus size={16} className="mr-1.5" />
                  Attendee Login
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
