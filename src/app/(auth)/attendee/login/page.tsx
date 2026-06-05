'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-white">
          <CalendarDays size={24} className="text-violet-400" />
          Byamn Events
        </div>

        <Card className="border-white/10 bg-zinc-900/80 shadow-2xl backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-white">Attendee sign in</CardTitle>
            <CardDescription className="text-zinc-400">
              View and manage your event registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="border-white/10 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus:border-violet-500"
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    {...register('password')}
                    className="border-white/10 bg-zinc-800/60 pr-10 text-white placeholder:text-zinc-500 focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-violet-600 font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 space-y-2 text-center text-sm text-zinc-500">
              <p>
                Don&apos;t have an account?{' '}
                <Link href="/events" className="text-violet-400 hover:text-violet-300 hover:underline">
                  Register via an event
                </Link>
              </p>
              <p>
                <Link href="/events" className="text-zinc-400 hover:text-zinc-300 hover:underline">
                  Browse events →
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
