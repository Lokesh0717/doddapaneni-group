import { NextResponse } from 'next/server';

/**
 * Health check for load balancers and hosting platforms (Vercel, Railway, etc.).
 * GET /api/health returns 200 when the app is running.
 */
export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
