import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import DeveloperDashboard from '@/components/dashboard/DeveloperDashboard';

export default async function DeveloperDashboardPage() {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user || session.user.role !== 'DEVELOPER') {
    redirect(`/${locale}/dashboard`);
  }

  return <DeveloperDashboard locale={locale} />;
}
