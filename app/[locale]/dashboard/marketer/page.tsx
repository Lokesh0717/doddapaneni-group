import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import MarketerDashboard from '@/components/dashboard/MarketerDashboard';

export default async function MarketerDashboardPage() {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user || session.user.role !== 'DIGITAL_MARKETER') {
    redirect(`/${locale}/dashboard`);
  }

  return <MarketerDashboard locale={locale} />;
}
