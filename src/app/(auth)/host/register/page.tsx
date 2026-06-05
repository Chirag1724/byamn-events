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
import { registerHostSchema, type RegisterHostInput } from '@/validators/host.validator';

export default function HostRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterHostInput>({
    resolver: zodResolver(registerHostSchema),
  });

  const onSubmit = async (data: RegisterHostInput) => {
    try {
      const res = await fetch('/api/auth/host/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as { success: boolean; message: string };

      if (!res.ok) {
        toast.error(json.message ?? 'Registration failed');
        return;
      }

      toast.success('Account created! Please log in.');
      router.push('/host/login');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-16">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-white">
          <CalendarDays size={24} className="text-violet-400" />
          Byamn Events
        </div>

        <Card className="border-white/10 bg-zinc-900/80 shadow-2xl backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-white">Create host account</CardTitle>
            <CardDescription className="text-zinc-400">
              Start hosting events in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-zinc-300">Full name</Label>
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  {...register('name')}
                  className="border-white/10 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus:border-violet-500"
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  {...register('email')}
                  className="border-white/10 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus:border-violet-500"
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
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
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Already have an account?{' '}
              <Link href="/host/login" className="text-violet-400 hover:text-violet-300 hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
