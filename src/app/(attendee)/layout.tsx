import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Navbar } from '@/components/shared/Navbar';

export default async function AttendeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('attendee_token');

  if (!token?.value) {
    redirect('/attendee/login');
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
