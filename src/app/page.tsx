import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  ShieldCheck,
  Download,
  ArrowRight,
  Users,
  Zap,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: CalendarDays,
    title: 'Effortless Event Creation',
    description:
      'Create polished events in seconds — title, date, location, capacity, and registration cutoff. No complexity, just results.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by Default',
    description:
      'Hosts protected by NextAuth.js. Attendees authenticated via signed JWT cookies. Passwords always hashed with bcrypt.',
  },
  {
    icon: Download,
    title: 'One-Click CSV Export',
    description:
      'Download your full attendee list instantly. Perfect for check-ins, follow-ups, and keeping your contacts organized.',
  },
  {
    icon: Users,
    title: 'Smart Registration',
    description:
      'Duplicate prevention, capacity limits, and cutoff dates enforced automatically. Focus on your event, not logistics.',
  },
  {
    icon: Zap,
    title: 'Instant Access',
    description:
      'Attendees register with a single form — no app install, no friction. Share a link and watch registrations roll in.',
  },
  {
    icon: Globe,
    title: 'Public Event Pages',
    description:
      'Every event gets a unique, shareable URL. No login required to browse or register. Open to the world.',
  },
];

const stats = [
  { label: 'Open Source', value: '100%' },
  { label: 'Setup Time', value: '< 5 min' },
  { label: 'Passwords Exposed', value: '0' },
  { label: 'Production Ready', value: '✓' },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080808]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-32 pt-28 text-center">
        {/* Background glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/12 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute left-1/4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-fuchsia-700/8 blur-[100px]" />
        </div>

        {/* Dot grid */}
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-30" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Badge */}
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/8 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-sm font-medium text-violet-300 tracking-wide">
              Professional Event Management Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up delay-100 mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-white">Discover &amp; </span>
            <span className="gradient-text">Host Events</span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up delay-200 mt-6 text-lg leading-relaxed text-zinc-400 sm:text-xl max-w-2xl mx-auto">
            Create memorable experiences. Register for events you love.
            <br className="hidden sm:block" />
            Powerful tools for hosts. Seamless journey for attendees.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up delay-300 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 w-full bg-violet-600 px-8 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-500 hover:shadow-violet-800/50 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
            >
              <Link href="/host/register">
                Host an Event
                <ArrowRight size={17} className="ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full border-white/10 bg-white/3 px-8 text-base font-semibold text-zinc-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/6 hover:text-white hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
            >
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up delay-400 mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {stats.map(({ label, value }, i) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                {i > 0 && <span className="hidden text-zinc-700 sm:inline">·</span>}
                <span className="font-semibold text-white">{value}</span>
                <span className="text-zinc-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero glassmorphism card — decorative */}
        <div className="animate-fade-up delay-500 relative z-10 mx-auto mt-20 w-full max-w-2xl">
          <div className="glass rounded-2xl p-5 gradient-border">
            <div className="flex items-center gap-3 border-b border-white/6 pb-4 mb-4">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-zinc-600 font-mono">byamn-events.vercel.app/events/byamn-dev-meetup</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold text-white">Byamn Dev Meetup 2026</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Jun 15 · 6:00 PM · Delhi</div>
                </div>
                <span className="rounded-full bg-green-500/12 border border-green-500/20 px-2.5 py-1 text-xs font-medium text-green-400">Open</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="grid grid-cols-3 gap-2 text-center">
                {['42 registered', 'Capacity: 100', '3 days left'].map((t) => (
                  <div key={t} className="rounded-lg bg-white/3 px-2 py-2 text-xs text-zinc-400">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-white/5 bg-[#0a0a0a] px-4 py-28">
        <div className="mx-auto max-w-5xl">
          {/* Section label */}
          <div className="mb-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Features</span>
          </div>
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need,{' '}
            <span className="text-zinc-500">nothing you don&apos;t</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className={`card-glow group relative rounded-xl border border-white/7 bg-[#111111] p-6 animate-fade-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/12 ring-1 ring-violet-500/20 transition-all group-hover:bg-violet-500/18 group-hover:ring-violet-500/35">
                  <Icon size={19} className="text-violet-400" />
                </div>
                <h3 className="mb-2 text-[15px] font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="border-t border-white/5 bg-[#080808] px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass gradient-border rounded-2xl px-8 py-12">
            <h2 className="mb-3 text-3xl font-bold text-white">
              Ready to host your event?
            </h2>
            <p className="mb-8 text-zinc-400">
              Sign up as a host for free and create your first event in minutes.
            </p>
            <Button
              asChild
              size="lg"
              className="h-12 bg-violet-600 px-10 text-base font-semibold text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500 hover:-translate-y-0.5 transition-all"
            >
              <Link href="/host/register">
                Get Started Free
                <ArrowRight size={17} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
