'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, CheckCircle2, User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { registerAttendeeSchema } from '@/validators/attendee.validator';

// Extend schema with confirmPassword client-side only
const registrationFormSchema = registerAttendeeSchema.extend({
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegistrationFormInput = z.infer<typeof registrationFormSchema>;

interface RegistrationFormProps {
  eventId: string;
  onSuccess?: () => void;
}

export function RegistrationForm({ eventId, onSuccess }: RegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormInput>({
    resolver: zodResolver(registrationFormSchema),
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('byamn_attendee_name');
      const savedEmail = localStorage.getItem('byamn_attendee_email');
      if (savedName) setValue('name', savedName);
      if (savedEmail) setValue('email', savedEmail);
    }
  }, [setValue]);

  const onSubmit = async (data: RegistrationFormInput) => {
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const json = (await res.json()) as { success: boolean; message: string };

      if (res.status === 409) {
        toast.error('You are already registered for this event');
        return;
      }
      if (res.status === 400) {
        toast.error(json.message ?? 'Registration not available');
        return;
      }
      if (!res.ok) {
        toast.error(json.message ?? 'Registration failed');
        return;
      }

      setRegistered(true);
      toast.success("You're registered!");
      if (typeof window !== 'undefined') {
        localStorage.setItem('byamn_attendee_name', data.name);
        localStorage.setItem('byamn_attendee_email', data.email);
      }
      onSuccess?.();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (registered) {
    return (
      <div className="animate-fade-up flex flex-col items-center gap-4 rounded-xl border border-green-500/20 bg-green-500/6 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 ring-2 ring-green-500/20">
          <CheckCircle2 size={28} className="text-green-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">You&apos;re registered!</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Log in to view and manage your event registrations.
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-green-600/80 text-white hover:bg-green-600 border-0 transition-all hover:-translate-y-px"
        >
          <a href="/attendee/login">View my events →</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-name" className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Full name
        </Label>
        <div className="relative">
          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <Input
            id="reg-name"
            placeholder="Jane Doe"
            {...register('name')}
            className="border-white/8 bg-white/4 pl-10 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-violet-500/50 focus:bg-white/6 focus:ring-0"
          />
        </div>
        {errors.name && (
          <p className="animate-fade-in text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-email" className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Email address
        </Label>
        <div className="relative">
          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <Input
            id="reg-email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className="border-white/8 bg-white/4 pl-10 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-violet-500/50 focus:bg-white/6 focus:ring-0"
          />
        </div>
        {errors.email && (
          <p className="animate-fade-in text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-password" className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Password
          <span className="ml-1.5 normal-case text-zinc-700">(creates your account)</span>
        </Label>
        <div className="relative">
          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <Input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            {...register('password')}
            className="border-white/8 bg-white/4 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-violet-500/50 focus:bg-white/6 focus:ring-0"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-400"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.password && (
          <p className="animate-fade-in text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-confirm" className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Confirm password
        </Label>
        <div className="relative">
          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <Input
            id="reg-confirm"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat password"
            {...register('confirmPassword')}
            className="border-white/8 bg-white/4 pl-10 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-violet-500/50 focus:bg-white/6 focus:ring-0"
          />
        </div>
        {errors.confirmPassword && (
          <p className="animate-fade-in text-xs text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-violet-600 font-semibold text-white shadow-lg shadow-violet-900/25 transition-all hover:bg-violet-500 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {isSubmitting ? (
          <><Loader2 size={15} className="mr-2 animate-spin" />Registering…</>
        ) : (
          <>Register for this event<ArrowRight size={15} className="ml-2" /></>
        )}
      </Button>
    </form>
  );
}
