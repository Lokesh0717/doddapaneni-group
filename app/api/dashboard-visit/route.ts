import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDb, DashboardVisit } from '@/lib/db';
import { formatInIST, formatInET } from '@/lib/date-timezones';
import type { Role } from '@/lib/constants';
import mongoose from 'mongoose';

const DASHBOARD_PATHS = ['dashboard', 'super-admin', 'admin', 'developer', 'marketer', 'employees'] as const;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let path: string;
  try {
    const body = await request.json();
    path = typeof body?.path === 'string' ? body.path.trim().toLowerCase() : '';
  } catch {
    path = '';
  }
  if (!path || !DASHBOARD_PATHS.includes(path as (typeof DASHBOARD_PATHS)[number])) {
    return NextResponse.json(
      { message: 'path must be one of: ' + DASHBOARD_PATHS.join(', ') },
      { status: 400 }
    );
  }

  try {
    await connectDb();

    const userId = mongoose.Types.ObjectId.isValid(session.user.id)
      ? new mongoose.Types.ObjectId(session.user.id)
      : null;
    if (!userId) {
      return NextResponse.json({ message: 'Invalid user' }, { status: 400 });
    }

    const visitedAt = new Date();
    await DashboardVisit.create({
      userId,
      path,
      role: session.user.role as Role,
      visitedAt,
      visitedAtIST: formatInIST(visitedAt),
      visitedAtET: formatInET(visitedAt),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Dashboard visit error:', error);
    return NextResponse.json({ message: 'Failed to record dashboard visit' }, { status: 500 });
  }
}
