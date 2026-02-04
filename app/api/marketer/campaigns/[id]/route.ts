import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDb, Campaign } from '@/lib/db';
import mongoose from 'mongoose';
import type { CampaignStatus } from '@/models/Campaign';

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
    const doc = await Campaign.findById(id).lean();
    if (!doc) return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
    return NextResponse.json({
      campaign: {
        id: String(doc._id),
        name: doc.name,
        description: doc.description ?? '',
        url: doc.url,
        status: doc.status,
        startDate: doc.startDate ? (doc.startDate as Date).toISOString() : null,
        endDate: doc.endDate ? (doc.endDate as Date).toISOString() : null,
        createdAt: (doc.createdAt as Date).toISOString(),
        updatedAt: (doc.updatedAt as Date).toISOString(),
      },
    });
  } catch (error) {
    console.error('Marketer campaign GET error:', error);
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
    let body: { name?: string; description?: string; url?: string; status?: string; startDate?: string; endDate?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
    await connectDb();
    const doc = await Campaign.findById(id);
    if (!doc) return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });

    if (typeof body.name === 'string' && body.name.trim()) doc.name = body.name.trim();
    if (typeof body.description === 'string') doc.description = body.description.trim();
    if (typeof body.url === 'string' && body.url.trim()) doc.url = body.url.trim();
    if (['draft', 'active', 'paused', 'ended'].includes(body.status ?? '')) doc.status = body.status as CampaignStatus;
    if (body.startDate !== undefined) doc.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined) doc.endDate = body.endDate ? new Date(body.endDate) : null;
    await doc.save();

    return NextResponse.json({
      campaign: {
        id: String(doc._id),
        name: doc.name,
        description: doc.description ?? '',
        url: doc.url,
        status: doc.status,
        startDate: doc.startDate ? doc.startDate.toISOString() : null,
        endDate: doc.endDate ? doc.endDate.toISOString() : null,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Marketer campaign PATCH error:', error);
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
    const deleted = await Campaign.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Marketer campaign DELETE error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
