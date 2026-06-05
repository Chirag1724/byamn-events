'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
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
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormInput>({
    resolver: zodResolver(registrationFormSchema),
  });

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
      toast.success('You\'re registered!');
      onSuccess?.();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (registered) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-green-800/40 bg-green-900/20 p-8 text-center">
        <CheckCircle2 size={40} className="text-green-400" />
        <h3 className="text-lg font-semibold text-white">You&apos;re registered!</h3>
        <p className="text-sm text-zinc-400">
          Log in to view and manage your event registrations.
        </p>
        <Button
          asChild
          size="sm"
          className="bg-violet-600 text-white hover:bg-violet-500"
        >
          <a href="/attendee/login">View my events →</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="reg-name" className="text-zinc-300">Full name</Label>
        <Input
          id="reg-name"
          placeholder="Jane Doe"
          {...register('name')}
          className="border-white/10 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-email" className="text-zinc-300">Email</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className="border-white/10 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-password" className="text-zinc-300">
          Password <span className="text-zinc-600">(creates your attendee account)</span>
        </Label>
        <div className="relative">
          <Input
            id="reg-password"
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
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-confirm" className="text-zinc-300">Confirm password</Label>
        <Input
          id="reg-confirm"
          type={showPassword ? 'text' : 'password'}
          placeholder="Repeat password"
          {...register('confirmPassword')}
          className="border-white/10 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-violet-600 font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
      >
        {isSubmitting ? 'Registering…' : 'Register for this event'}
      </Button>
    </form>
  );
}
