import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDb, User, LoginLog, DeveloperPageView, PasswordChangeLog } from '@/lib/db';
import { formatInIST, formatInET } from '@/lib/date-timezones';
import { sendRoleDeletedEmailToDeleter, sendRoleDeletedEmailToDeletedUser } from '@/lib/email';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ADMIN_ALLOWED_PASSWORD_CHANGE_ROLES = ['DEVELOPER', 'DIGITAL_MARKETER'] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    const currentUserId = session?.user?.id;
    const isSuperAdmin = role === 'SUPER_ADMIN';
    const isAdmin = role === 'ADMIN';

    if (!session?.user || (!isSuperAdmin && !isAdmin)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid user id' }, { status: 400 });
    }

    if (id === currentUserId) {
      return NextResponse.json({ message: 'Cannot change your own password here. Use profile/settings if available.' }, { status: 400 });
    }

    let body: { password?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
    const newPassword = typeof body?.password === 'string' ? body.password.trim() : '';
    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectDb();
    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const targetRole = user.role as string;
    if (isAdmin && !ADMIN_ALLOWED_PASSWORD_CHANGE_ROLES.includes(targetRole as any)) {
      return NextResponse.json(
        { message: 'Admin can only change password for Developer or Digital Marketer' },
        { status: 403 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const passwordChangedAt = new Date();
    await User.findByIdAndUpdate(id, { passwordHash, passwordChangedAt });

    const changedByObjectId = currentUserId && mongoose.Types.ObjectId.isValid(currentUserId)
      ? new mongoose.Types.ObjectId(currentUserId)
      : null;
    const targetUserObjectId = new mongoose.Types.ObjectId(id);
    if (changedByObjectId) {
      await PasswordChangeLog.create({
        changedById: changedByObjectId,
        targetUserId: targetUserObjectId,
        changedByRole: role ?? '',
        changedAt: passwordChangedAt,
        changedAtIST: formatInIST(passwordChangedAt),
        changedAtET: formatInET(passwordChangedAt),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    const currentUserId = session?.user?.id;
    const isSuperAdmin = role === 'SUPER_ADMIN';
    const isAdmin = role === 'ADMIN';

    if (!session?.user || (!isSuperAdmin && !isAdmin)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid user id' }, { status: 400 });
    }

    if (id === currentUserId) {
      return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 });
    }

    await connectDb();
    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const targetRole = user.role as string;
    if (targetRole === 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Cannot delete Super Admin' }, { status: 403 });
    }
    if (isAdmin && (targetRole === 'ADMIN' || targetRole === 'SUPER_ADMIN')) {
      return NextResponse.json({ message: 'Admin can only delete Developer or Digital Marketer' }, { status: 403 });
    }

    const deletedUserEmail = user.email;
    const deletedUserName = user.name ?? null;
    const deletedUserRole = targetRole;

    const objectId = new mongoose.Types.ObjectId(id);
    const loginLogs = await LoginLog.find({ userId: objectId }).lean();
    const loginLogIds = loginLogs.map((l) => l._id);
    if (loginLogIds.length > 0) {
      await DeveloperPageView.deleteMany({ loginLogId: { $in: loginLogIds } });
    }
    await LoginLog.deleteMany({ userId: objectId });
    await User.findByIdAndDelete(id);

    const deletedAt = new Date();
    const deleterEmail = session.user.email ?? '';
    const deleterName = session.user.name ?? null;
    const deleterRole = session.user.role ?? '';
    if (deleterEmail) {
      sendRoleDeletedEmailToDeleter(
        deleterEmail,
        deleterRole,
        deletedUserEmail,
        deletedUserName,
        deletedUserRole,
        deletedAt
      ).catch((err) => console.error('Role deleted email to deleter failed:', err));
    }
    sendRoleDeletedEmailToDeletedUser(
      deletedUserEmail,
      deletedUserName,
      deletedUserRole,
      deleterRole,
      deleterName,
      deletedAt
    ).catch((err) => console.error('Role deleted email to deleted user failed:', err));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
