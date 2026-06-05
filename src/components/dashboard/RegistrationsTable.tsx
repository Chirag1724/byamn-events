'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Search, Users } from 'lucide-react';
import type { RegistrationRow } from '@/types/api.types';

interface RegistrationsTableProps {
  eventId: string;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RegistrationsTable({ eventId }: RegistrationsTableProps) {
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}/registrations`);
        if (!res.ok) return;
        const json = (await res.json()) as { success: boolean; data: RegistrationRow[] };
        if (json.success) setRegistrations(json.data);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [eventId]);

  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner className="py-12" />;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-white/10 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Users size={36} className="text-zinc-600" />
          <p className="text-sm text-zinc-500">
            {registrations.length === 0
              ? 'No registrations yet'
              : 'No results match your search'}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-medium">Name</TableHead>
                <TableHead className="text-zinc-400 font-medium">Email</TableHead>
                <TableHead className="text-zinc-400 font-medium">Registered at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r, i) => (
                <TableRow
                  key={`${r.email}-${i}`}
                  className="border-white/5 hover:bg-zinc-800/40"
                >
                  <TableCell className="text-zinc-200 font-medium">{r.name}</TableCell>
                  <TableCell className="text-zinc-400">{r.email}</TableCell>
                  <TableCell className="text-zinc-500 text-sm">{formatDate(r.registeredAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="border-t border-white/5 px-4 py-3 text-xs text-zinc-500">
            {filtered.length} of {registrations.length} attendee{registrations.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
