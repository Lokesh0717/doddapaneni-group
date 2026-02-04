import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { connectDb, User } from '@/lib/db';
import type { Role } from '@/lib/constants';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

export default async function AdminDashboardPage() {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect(`/${locale}/dashboard`);
  }

  await connectDb();

  const userDocs = await User.find().sort({ createdAt: -1 }).lean();
  const users = userDocs.map((u: { _id: unknown; email: string; name: string | null; role: string; createdAt: Date; createdAtIST?: string | null; createdAtET?: string | null; createdAtUSA?: string | null }) => ({
    id: String(u._id),
    email: u.email,
    name: u.name ?? null,
    role: u.role as Role,
    createdAt: u.createdAt,
    createdAtIST: u.createdAtIST ?? null,
    createdAtET: u.createdAtET ?? u.createdAtUSA ?? null,
  }));

  return (
    <AdminDashboard
      users={users}
      locale={locale}
      currentUserId={session.user.id}
    />
  );
}
