'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface ExportButtonProps {
  eventId: string;
}

export function ExportButton({ eventId }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/export`);

      if (!res.ok) {
        const json = (await res.json()) as { message?: string };
        toast.error(json.message ?? 'Export failed');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registrations-${eventId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success('CSV downloaded successfully');
    } catch {
      toast.error('Failed to export registrations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      variant="outline"
      size="sm"
      className="border-white/10 text-zinc-300 hover:border-violet-500/50 hover:text-violet-300"
    >
      {loading ? (
        <Loader2 size={14} className="mr-2 animate-spin" />
      ) : (
        <Download size={14} className="mr-2" />
      )}
      {loading ? 'Exporting…' : 'Export CSV'}
    </Button>
  );
}
