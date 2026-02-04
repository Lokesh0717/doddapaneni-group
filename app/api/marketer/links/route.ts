import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDb, MarketingLink } from '@/lib/db';
import mongoose from 'mongoose';
import type { MarketingLinkType } from '@/models/MarketingLink';

function allowMarketer(session: { user?: { role?: string } } | null) {
  const role = session?.user?.role;
  return role === 'DIGITAL_MARKETER' || role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !allowMarketer(session)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    await connectDb();
    const list = await MarketingLink.find()
      .sort({ updatedAt: -1 })
      .lean();
    const links = list.map((l: { _id: unknown; createdAt: Date; updatedAt: Date; [k: string]: unknown }) => ({
      id: String(l._id),
      name: l.name,
      url: l.url,
      description: l.description ?? '',
      type: l.type as MarketingLinkType,
      createdAt: (l.createdAt as Date).toISOString(),
      updatedAt: (l.updatedAt as Date).toISOString(),
    }));
    return NextResponse.json({ links });
  } catch (error) {
    console.error('Marketer links GET error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !allowMarketer(session)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    let body: { name?: string; url?: string; description?: string; type?: MarketingLinkType };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const url = typeof body.url === 'string' ? body.url.trim() : '';
    if (!name || !url) {
      return NextResponse.json({ message: 'name and url are required' }, { status: 400 });
    }
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const type = ['tool', 'integration', 'resource', 'other'].includes(body.type ?? '') ? body.type : 'resource';
    const createdById = session.user.id && mongoose.Types.ObjectId.isValid(session.user.id)
      ? new mongoose.Types.ObjectId(session.user.id)
      : null;

    await connectDb();
    const doc = await MarketingLink.create({
      name,
      url,
      description,
      type: type as MarketingLinkType,
      createdById,
    });
    return NextResponse.json({
      link: {
        id: String(doc._id),
        name: doc.name,
        url: doc.url,
        description: doc.description ?? '',
        type: doc.type,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Marketer links POST error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
