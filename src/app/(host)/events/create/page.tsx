'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventForm } from '@/components/events/EventForm';

export default function CreateEventPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4 text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Back
        </Button>
        <h1 className="text-3xl font-extrabold text-white">Create a new event</h1>
        <p className="mt-2 text-zinc-400">Fill in the details below to publish your event.</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-sm">
        <EventForm onSuccess={() => router.push('/dashboard')} />
      </div>
    </div>
  );
}
