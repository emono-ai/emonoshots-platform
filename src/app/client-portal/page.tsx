// src/app/client-portal/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { ClientPortalDashboard } from '@/components/client/ClientPortalDashboard';

export const metadata = { title: 'Client Portal' };

export default async function ClientPortalPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin?callbackUrl=/client-portal');
  return <ClientPortalDashboard session={session} />;
}
