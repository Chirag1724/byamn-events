import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarDays, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080808] px-4 text-center">
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/8 blur-[110px]" />
      </div>

      {/* Dot grid */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-20" />

      {/* Brand logo at top */}
      <div className="absolute top-8 left-8 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30 transition-all group-hover:ring-violet-500/50">
            <CalendarDays size={18} className="text-violet-400" />
          </div>
          <span className="text-lg font-semibold text-white">
            Byamn <span className="font-normal text-zinc-500">Events</span>
          </span>
        </Link>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <div className="glass gradient-border rounded-2xl p-10">
          {/* Large 404 Code */}
          <span className="gradient-text text-8xl font-black tracking-widest block select-none mb-4 animate-float">
            404
          </span>

          <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
          
          <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            The page you are looking for doesn&apos;t exist or has been moved. Check the URL or head back to the home page.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Button
              asChild
              size="lg"
              className="h-11 w-full sm:w-auto bg-violet-600 font-semibold text-white shadow-lg shadow-violet-900/30 transition-all hover:bg-violet-500 hover:-translate-y-0.5"
            >
              <Link href="/">
                <Home size={15} className="mr-2" />
                Go Back Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 w-full sm:w-auto border-white/10 text-zinc-400 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              <Link href="/events">
                Browse Events
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer message */}
      <p className="absolute bottom-8 text-xs text-zinc-700 relative z-10">
        Lost? Feel free to contact Chirag for assistance.
      </p>
    </div>
  );
}
