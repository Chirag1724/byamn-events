import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Byamn Events — Discover & Host Events',
  description:
    'Create memorable experiences. Register for events you love. The professional event management platform.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn('h-full antialiased dark', inter.variable)}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f4f4f5',
            },
          }}
        />
      </body>
    </html>
  );
}
