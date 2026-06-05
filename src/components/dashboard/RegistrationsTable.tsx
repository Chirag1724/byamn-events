'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Search, Users, Mail, User } from 'lucide-react';
import type { RegistrationRow } from '@/types/api.types';

interface RegistrationsTableProps {
  eventId: string;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
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
      {/* Search bar */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-white/8 bg-white/4 pl-9 text-sm text-white placeholder:text-zinc-700 focus:border-violet-500/40 focus:bg-white/6 focus:ring-0"
        />
      </div>

      {filtered.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/4 ring-1 ring-white/8">
            <Users size={20} className="text-zinc-600" />
          </div>
          <p className="text-sm text-zinc-600">
            {registrations.length === 0
              ? 'No registrations yet'
              : 'No results match your search'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/7">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/7 bg-white/2 hover:bg-transparent">
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <User size={11} />
                    Name
                  </div>
                </TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <Mail size={11} />
                    Email
                  </div>
                </TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Registered
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r, i) => (
                <TableRow
                  key={`${r.email}-${i}`}
                  className={`border-b border-white/4 transition-colors hover:bg-white/2 ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-white/1'
                  }`}
                >
                  <TableCell className="py-3 font-medium text-zinc-200">
                    {r.name}
                  </TableCell>
                  <TableCell className="py-3 text-zinc-400">
                    {r.email}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-zinc-600">
                    {formatDate(r.registeredAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Footer count */}
          <div className="flex items-center justify-between border-t border-white/5 bg-white/1 px-4 py-2.5 text-xs text-zinc-700">
            <span>
              {filtered.length === registrations.length
                ? `${registrations.length} attendee${registrations.length !== 1 ? 's' : ''}`
                : `${filtered.length} of ${registrations.length} attendees`}
            </span>
            <span className="text-zinc-800">Name · Email only — no passwords</span>
          </div>
        </div>
      )}
    </div>
  );
}
