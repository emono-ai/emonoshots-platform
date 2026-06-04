// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const bookings = await prisma.booking.findMany({
    where: user.role === 'ADMIN' ? {} : { clientId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { invoice: { select: { status: true, total: true } } },
  });

  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();
  const { type, title, description, proposedDate, locationName, estimatedPrice, moodboard, notes } = body;

  if (!type || !title) return NextResponse.json({ error: 'type and title required' }, { status: 400 });

  const booking = await prisma.booking.create({
    data: {
      clientId: user.id,
      type, title, description, notes, moodboard,
      locationName, estimatedPrice,
      proposedDate: proposedDate ? new Date(proposedDate) : undefined,
      status: 'INQUIRY',
    },
  });

  return NextResponse.json({ booking }, { status: 201 });
}
