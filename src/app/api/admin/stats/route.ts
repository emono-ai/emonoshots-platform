// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const [bookingCount, leadCount, clientCount] = await Promise.all([
    prisma.booking.count({ where: { status: { not: 'CANCELLED' } } }),
    prisma.conciergeLead.count({ where: { convertedAt: null } }),
    prisma.user.count({ where: { role: 'CLIENT' } }),
  ]);
  return NextResponse.json({ bookingCount, leadCount, clientCount });
}
