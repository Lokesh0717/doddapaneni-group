import { NextResponse } from 'next/server';
import { connectDb, Visit } from '@/lib/db';
import { formatInIST, formatInET } from '@/lib/date-timezones';

/** Only record website visits when the app is live (production). Local/dev visits are not counted. */
export async function POST() {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({ ok: true });
  }

  try {
    await connectDb();
    const visitedAt = new Date();
    await Visit.create({
      visitedAt,
      visitedAtIST: formatInIST(visitedAt),
      visitedAtET: formatInET(visitedAt),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Record visit error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
