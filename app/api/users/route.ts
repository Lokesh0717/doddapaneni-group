import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDb, User } from '@/lib/db';
import { formatInIST, formatInET } from '@/lib/date-timezones';
import { sendRoleCreatedEmailToCreator, sendRoleCreatedEmailToNewUser } from '@/lib/email';
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import type { Role } from '@/lib/constants';
import mongoose from 'mongoose';

const createUserSchemaAdmin = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.enum(['DEVELOPER', 'DIGITAL_MARKETER']),
});

const createUserSchemaSuperAdmin = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.enum(['ADMIN', 'DEVELOPER', 'DIGITAL_MARKETER']),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    const isSuperAdmin = role === 'SUPER_ADMIN';
    const isAdmin = role === 'ADMIN';
    if (!session?.user || (!isSuperAdmin && !isAdmin)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = isSuperAdmin
      ? createUserSchemaSuperAdmin.safeParse(body)
      : createUserSchemaAdmin.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name, role: newUserRole } = parsed.data;
    const emailLower = email.trim().toLowerCase();

    await connectDb();
    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      return NextResponse.json(
        { message: 'This email is already in use. Each login must use a different email across all roles.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const createdByObjectId = mongoose.Types.ObjectId.isValid(session.user.id)
      ? new mongoose.Types.ObjectId(session.user.id)
      : undefined;
    const createdAt = new Date();
    const doc = await User.create({
      email: emailLower,
      passwordHash,
      name: name?.trim() || null,
      role: newUserRole as Role,
      createdById: createdByObjectId ?? null,
      createdAtIST: formatInIST(createdAt),
      createdAtET: formatInET(createdAt),
    });

    const user = {
      id: String(doc._id),
      email: doc.email,
      name: doc.name ?? null,
      role: doc.role,
      createdAt: doc.createdAt,
      createdAtIST: doc.createdAtIST ?? null,
      createdAtET: doc.createdAtET ?? null,
    };

    const creatorEmail = session.user.email ?? '';
    const creatorName = session.user.name ?? null;
    const creatorRole = session.user.role ?? '';
    if (creatorEmail) {
      sendRoleCreatedEmailToCreator(creatorEmail, creatorRole, newUserRole, createdAt).catch((err) =>
        console.error('Role created email to creator failed:', err)
      );
    }
    sendRoleCreatedEmailToNewUser(
      doc.email,
      doc.name ?? null,
      newUserRole,
      creatorRole,
      creatorName,
      createdAt,
      password
    ).catch((err) => console.error('Role created email to new user failed:', err));

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
