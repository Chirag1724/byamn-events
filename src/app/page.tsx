import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, ShieldCheck, Download, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: CalendarDays,
    title: 'Easy Registration',
    description:
      'Attendees register with a single form. No complex flows, no friction — just show up and join.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Authentication',
    description:
      'Hosts protected by NextAuth. Attendees authenticated via signed JWT cookies. Passwords always hashed.',
  },
  {
    icon: Download,
    title: 'CSV Export',
    description:
      'Download your full attendee list as a CSV with one click. Perfect for check-ins and follow-ups.',
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-32 text-center">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
            Professional Event Management
          </span>

          <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Discover &amp;{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Host Events
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Create memorable experiences. Register for events you love.
            <br className="hidden sm:block" />
            Powerful tools for hosts. Seamless experience for attendees.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-violet-600 px-8 text-base font-semibold text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500"
            >
              <Link href="/host/register">
                Host an Event
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-white/20 px-8 text-base font-semibold text-zinc-200 hover:border-white/40 hover:bg-white/5 hover:text-white"
            >
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 bg-zinc-900/40 px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Everything you need
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="border-white/10 bg-zinc-900/60 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-zinc-900"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30">
                    <Icon size={22} className="text-violet-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Byamn Events. Built for the BYAMN internship task.
      </footer>
    </div>
  );
}
