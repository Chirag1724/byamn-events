import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/nextauth';
import { Navbar } from '@/components/shared/Navbar';

export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.hostId) {
    redirect('/host/login');
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
