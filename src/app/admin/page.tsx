// src/app/admin/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata = { title: 'Admin Dashboard' };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || role !== 'ADMIN') redirect('/auth/signin?callbackUrl=/admin');
  return <AdminDashboard />;
}
