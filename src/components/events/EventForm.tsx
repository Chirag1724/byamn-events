'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createEventSchema, type CreateEventInput } from '@/validators/event.validator';

interface EventFormProps {
  onSuccess: () => void;
}

export function EventForm({ onSuccess }: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
  });

  const onSubmit = async (data: CreateEventInput) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as { success: boolean; message: string };

      if (!res.ok) {
        toast.error(json.message ?? 'Failed to create event');
        return;
      }

      toast.success('Event created successfully!');
      reset();
      onSuccess();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-zinc-300">Event title</Label>
        <Input
          id="title"
          placeholder="Byamn Dev Meetup 2026"
          {...register('title')}
          className="border-white/10 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-zinc-300">Description</Label>
        <textarea
          id="description"
          rows={3}
          placeholder="Tell attendees what to expect…"
          {...register('description')}
          className="w-full rounded-md border border-white/10 bg-zinc-800/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-0 resize-none"
        />
        {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="date" className="text-zinc-300">Date</Label>
          <Input
            id="date"
            type="date"
            {...register('date')}
            className="border-white/10 bg-zinc-800/60 text-white focus:border-violet-500 [color-scheme:dark]"
          />
          {errors.date && <p className="text-xs text-red-400">{errors.date.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="time" className="text-zinc-300">Time</Label>
          <Input
            id="time"
            type="time"
            {...register('time')}
            className="border-white/10 bg-zinc-800/60 text-white focus:border-violet-500 [color-scheme:dark]"
          />
          {errors.time && <p className="text-xs text-red-400">{errors.time.message}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <Label htmlFor="location" className="text-zinc-300">Location</Label>
        <Input
          id="location"
          placeholder="Dhaka, Bangladesh"
          {...register('location')}
          className="border-white/10 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.location && <p className="text-xs text-red-400">{errors.location.message}</p>}
      </div>

      {/* Capacity + Cutoff */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="capacity" className="text-zinc-300">
            Capacity <span className="text-zinc-600">(optional)</span>
          </Label>
          <Input
            id="capacity"
            type="number"
            min={1}
            placeholder="100"
            {...register('capacity', { valueAsNumber: true })}
            className="border-white/10 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
          {errors.capacity && <p className="text-xs text-red-400">{errors.capacity.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="registrationCutoff" className="text-zinc-300">
            Cutoff date <span className="text-zinc-600">(optional)</span>
          </Label>
          <Input
            id="registrationCutoff"
            type="date"
            {...register('registrationCutoff')}
            className="border-white/10 bg-zinc-800/60 text-white focus:border-violet-500 [color-scheme:dark]"
          />
          {errors.registrationCutoff && (
            <p className="text-xs text-red-400">{errors.registrationCutoff.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-violet-600 font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
      >
        {isSubmitting ? 'Creating event…' : 'Create event'}
      </Button>
    </form>
  );
}
