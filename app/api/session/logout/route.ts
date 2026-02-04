import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDb, LoginLog } from '@/lib/db';

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDb();
    const latest = await LoginLog.findOne({
      userId: session.user.id,
      loggedOutAt: null,
    }).sort({ loggedAt: -1 });

    if (latest) {
      latest.loggedOutAt = new Date();
      await latest.save();
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Session logout error:', error);
    return NextResponse.json({ message: 'Failed to record logout' }, { status: 500 });
  }
}
