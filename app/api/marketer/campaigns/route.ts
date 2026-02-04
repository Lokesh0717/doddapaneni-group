import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDb, Campaign } from '@/lib/db';
import mongoose from 'mongoose';
import type { CampaignStatus } from '@/models/Campaign';

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
    const list = await Campaign.find()
      .sort({ updatedAt: -1 })
      .lean();
    const campaigns = list.map((c) => ({
      id: String(c._id),
      name: c.name,
      description: c.description ?? '',
      url: c.url,
      status: c.status as CampaignStatus,
      startDate: c.startDate ? c.startDate.toISOString() : null,
      endDate: c.endDate ? c.endDate.toISOString() : null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Marketer campaigns GET error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !allowMarketer(session)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    let body: { name?: string; description?: string; url?: string; status?: CampaignStatus; startDate?: string; endDate?: string };
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
    const status = ['draft', 'active', 'paused', 'ended'].includes(body.status ?? '') ? body.status : 'draft';
    const startDate = body.startDate ? new Date(body.startDate) : null;
    const endDate = body.endDate ? new Date(body.endDate) : null;
    const createdById = session.user.id && mongoose.Types.ObjectId.isValid(session.user.id)
      ? new mongoose.Types.ObjectId(session.user.id)
      : null;

    await connectDb();
    const doc = await Campaign.create({
      name,
      description,
      url,
      status,
      startDate: startDate && !isNaN(startDate.getTime()) ? startDate : null,
      endDate: endDate && !isNaN(endDate.getTime()) ? endDate : null,
      createdById,
    });
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
    console.error('Marketer campaigns POST error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
