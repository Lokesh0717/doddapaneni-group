import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDb, MarketingLink } from '@/lib/db';
import mongoose from 'mongoose';
import type { MarketingLinkType } from '@/models/MarketingLink';

function allowMarketer(session: { user?: { role?: string } } | null) {
  const role = session?.user?.role;
  return role === 'DIGITAL_MARKETER' || role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !allowMarketer(session)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }
    await connectDb();
    const doc = await MarketingLink.findById(id).lean();
    if (!doc) return NextResponse.json({ message: 'Link not found' }, { status: 404 });
    return NextResponse.json({
      link: {
        id: String(doc._id),
        name: doc.name,
        url: doc.url,
        description: doc.description ?? '',
        type: doc.type,
        createdAt: (doc.createdAt as Date).toISOString(),
        updatedAt: (doc.updatedAt as Date).toISOString(),
      },
    });
  } catch (error) {
    console.error('Marketer link GET error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !allowMarketer(session)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }
    let body: { name?: string; url?: string; description?: string; type?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
    await connectDb();
    const doc = await MarketingLink.findById(id);
    if (!doc) return NextResponse.json({ message: 'Link not found' }, { status: 404 });

    if (typeof body.name === 'string' && body.name.trim()) doc.name = body.name.trim();
    if (typeof body.url === 'string' && body.url.trim()) doc.url = body.url.trim();
    if (typeof body.description === 'string') doc.description = body.description.trim();
    if (['tool', 'integration', 'resource', 'other'].includes(body.type ?? '')) doc.type = body.type as MarketingLinkType;
    await doc.save();

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
    console.error('Marketer link PATCH error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !allowMarketer(session)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }
    await connectDb();
    const deleted = await MarketingLink.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: 'Link not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Marketer link DELETE error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
