import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import type { Role } from '@/lib/constants';

export default async function DashboardPage() {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const role = session.user.role as Role;

  if (role === 'SUPER_ADMIN') redirect(`/${locale}/dashboard/super-admin`);
  if (role === 'ADMIN') redirect(`/${locale}/dashboard/admin`);
  if (role === 'DEVELOPER') redirect(`/${locale}/dashboard/developer`);
  if (role === 'DIGITAL_MARKETER') redirect(`/${locale}/dashboard/marketer`);

  redirect(`/${locale}/dashboard/admin`);
}
