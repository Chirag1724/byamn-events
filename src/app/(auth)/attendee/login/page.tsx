'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, CalendarDays, Mail, Lock, Loader2, ArrowRight, Ticket, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAttendeeSchema, type LoginAttendeeInput } from '@/validators/attendee.validator';

export default function AttendeeLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginAttendeeInput>({
    resolver: zodResolver(loginAttendeeSchema),
  });

  const onSubmit = async (data: LoginAttendeeInput) => {
    try {
      const res = await fetch('/api/auth/attendee/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as { success: boolean; message: string };

      if (!res.ok) {
        toast.error(json.message ?? 'Login failed');
        return;
      }

      toast.success('Welcome back!');
      router.push('/my-events');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-4 py-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-fuchsia-700/8 blur-[100px]" />
      </div>
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 text-zinc-500 hover:text-white"
        >
          <Link href="/">
            <ArrowLeft size={14} className="mr-1.5" />
            Back to Home
          </Link>
        </Button>

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
        <div className="glass gradient-border rounded-2xl p-8">
          {/* Header */}
          <div className="mb-7">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/12 ring-1 ring-violet-500/20">
              <Ticket size={18} className="text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Attendee sign in</h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              View and manage your event registrations
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="al-email" className="text-sm font-medium text-zinc-300">
                Email address
              </Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="al-email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="border-white/8 bg-white/4 pl-10 text-white placeholder:text-zinc-600 transition-colors focus:border-violet-500/60 focus:bg-white/6 focus:ring-0"
                />
              </div>
              {errors.email && (
                <p className="animate-fade-in text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="al-password" className="text-sm font-medium text-zinc-300">
                Password
              </Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="al-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  {...register('password')}
                  className="border-white/8 bg-white/4 pl-10 pr-10 text-white placeholder:text-zinc-600 transition-colors focus:border-violet-500/60 focus:bg-white/6 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="animate-fade-in text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full bg-violet-600 font-semibold text-white shadow-lg shadow-violet-900/30 transition-all hover:bg-violet-500 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {isSubmitting ? (
                <><Loader2 size={15} className="mr-2 animate-spin" />Signing in…</>
              ) : (
                <>Sign in<ArrowRight size={15} className="ml-2" /></>
              )}
            </Button>
          </form>

          <div className="mt-6 border-t border-white/6 pt-5 space-y-2 text-center text-sm text-zinc-600">
            <p>
              No account yet?{' '}
              <Link href="/events" className="text-violet-400 transition-colors hover:text-violet-300">
                Register via an event
              </Link>
            </p>
            <p>
              <Link href="/events" className="text-zinc-500 transition-colors hover:text-zinc-400">
                Browse events →
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-700">
          Are you a host?{' '}
          <Link href="/host/login" className="text-zinc-500 hover:text-zinc-400 transition-colors">
            Host sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
